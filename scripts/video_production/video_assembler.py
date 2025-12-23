#!/usr/bin/env python3
"""
Video Assembler Module
Synchronizes audio and visuals and renders final MP4 video.
"""

import os
import subprocess
from pathlib import Path
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class VideoAssembler:
    """Assembles final video from audio and visual components."""
    
    def __init__(
        self,
        output_dir: str,
        resolution: str = "1920x1080",
        fps: int = 30
    ):
        """
        Initialize the video assembler.
        
        Args:
            output_dir: Directory for output files
            resolution: Video resolution
            fps: Frames per second
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.resolution = resolution
        self.fps = fps
        
    def assemble(
        self,
        script_name: str,
        scenes: List[Dict],
        audio_files: List[Dict],
        visual_files: List[Dict]
    ) -> Optional[str]:
        """
        Assemble final video.
        
        Args:
            script_name: Base name for output
            scenes: List of scene dictionaries
            audio_files: List of audio file info dicts
            visual_files: List of visual file info dicts
            
        Returns:
            Path to final video file, or None if failed
        """
        output_file = self.output_dir / f"{script_name}.mp4"
        
        # Check FFmpeg availability
        if not self._check_command("ffmpeg"):
            logger.error("FFmpeg not available, cannot assemble video")
            return None
        
        # Match audio and visuals to scenes
        scene_components = []
        for scene in scenes:
            scene_num = scene['scene_num']
            
            # Find audio
            audio = next((a for a in audio_files if a['scene_num'] == scene_num), None)
            # Find visual
            visual = next((v for v in visual_files if v['scene_num'] == scene_num), None)
            
            if audio and visual:
                scene_components.append({
                    "scene_num": scene_num,
                    "audio_path": audio['path'],
                    "audio_duration": audio.get('duration'),
                    "visual_path": visual['path'],
                    "visual_type": visual.get('type'),
                    "heading": scene.get('heading', f'Scene {scene_num}')
                })
            else:
                logger.warning(f"Missing components for scene {scene_num}")
                if not audio:
                    logger.warning(f"  No audio found")
                if not visual:
                    logger.warning(f"  No visual found")
        
        if not scene_components:
            logger.error("No complete scenes to assemble")
            return None
        
        logger.info(f"Assembling video from {len(scene_components)} scene(s)...")
        
        # Create individual scene videos
        scene_videos = []
        for component in scene_components:
            scene_video = self._create_scene_video(component, script_name)
            if scene_video:
                scene_videos.append(scene_video)
        
        if not scene_videos:
            logger.error("No scene videos were created")
            return None
        
        # Concatenate scene videos
        logger.info("Concatenating scenes...")
        success = self._concatenate_videos(scene_videos, str(output_file))
        
        # Clean up scene videos
        for scene_video in scene_videos:
            try:
                Path(scene_video).unlink()
            except:
                pass
        
        if success and output_file.exists():
            file_size = output_file.stat().st_size / (1024 * 1024)  # MB
            logger.info(f"✓ Video created: {output_file.name} ({file_size:.1f} MB)")
            return str(output_file)
        else:
            logger.error("✗ Video assembly failed")
            return None
    
    def _create_scene_video(
        self,
        component: Dict,
        script_name: str
    ) -> Optional[str]:
        """
        Create video for a single scene.
        
        Args:
            component: Scene component dict with audio and visual paths
            script_name: Base name
            
        Returns:
            Path to scene video file
        """
        scene_num = component['scene_num']
        audio_path = component['audio_path']
        visual_path = component['visual_path']
        visual_type = component.get('visual_type', 'unknown')
        audio_duration = component.get('audio_duration')
        
        output_file = self.output_dir / f"{script_name}_scene{scene_num:02d}.mp4"
        
        logger.info(f"  Creating video for scene {scene_num}...")
        
        try:
            # Get audio duration if not provided
            if not audio_duration:
                audio_duration = self._get_duration(audio_path)
            
            if not audio_duration:
                logger.error(f"    Cannot determine audio duration")
                return None
            
            # Handle different visual types
            if visual_type in ['title_card', 'diagram']:
                # Static image - create video from image
                success = self._create_video_from_image(
                    visual_path,
                    audio_path,
                    str(output_file),
                    audio_duration
                )
            elif visual_type == 'demo_capture':
                # Video - trim or loop to match audio duration
                success = self._sync_video_with_audio(
                    visual_path,
                    audio_path,
                    str(output_file),
                    audio_duration
                )
            else:
                logger.error(f"    Unknown visual type: {visual_type}")
                return None
            
            if success:
                logger.info(f"    ✓ Scene {scene_num} video created")
                return str(output_file)
            else:
                logger.error(f"    ✗ Failed to create scene {scene_num} video")
                return None
                
        except Exception as e:
            logger.error(f"    Error creating scene video: {e}")
            return None
    
    def _create_video_from_image(
        self,
        image_path: str,
        audio_path: str,
        output_path: str,
        duration: float
    ) -> bool:
        """
        Create video from static image and audio.
        
        Args:
            image_path: Path to image file
            audio_path: Path to audio file
            output_path: Output video path
            duration: Video duration in seconds
            
        Returns:
            True if successful
        """
        try:
            cmd = [
                "ffmpeg", "-y",
                "-loop", "1",
                "-i", image_path,
                "-i", audio_path,
                "-c:v", "libx264",
                "-preset", "medium",
                "-tune", "stillimage",
                "-crf", "23",
                "-c:a", "aac",
                "-b:a", "192k",
                "-pix_fmt", "yuv420p",
                "-shortest",
                "-fflags", "+shortest",
                "-max_interleave_delta", "100M",
                output_path
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                logger.error(f"FFmpeg error: {result.stderr}")
            
            return result.returncode == 0 and Path(output_path).exists()
            
        except Exception as e:
            logger.error(f"Error creating video from image: {e}")
            return False
    
    def _sync_video_with_audio(
        self,
        video_path: str,
        audio_path: str,
        output_path: str,
        target_duration: float
    ) -> bool:
        """
        Synchronize video with audio, trimming or looping as needed.
        
        Args:
            video_path: Path to video file
            audio_path: Path to audio file
            output_path: Output video path
            target_duration: Target duration in seconds
            
        Returns:
            True if successful
        """
        try:
            # Get video duration
            video_duration = self._get_duration(video_path)
            if not video_duration:
                logger.error("Cannot determine video duration")
                return False
            
            # Decide whether to trim or loop
            if video_duration >= target_duration:
                # Trim video to match audio
                cmd = [
                    "ffmpeg", "-y",
                    "-i", video_path,
                    "-i", audio_path,
                    "-t", str(target_duration),
                    "-c:v", "libx264",
                    "-preset", "medium",
                    "-crf", "23",
                    "-c:a", "aac",
                    "-b:a", "192k",
                    "-map", "0:v:0",
                    "-map", "1:a:0",
                    output_path
                ]
            else:
                # Loop video to match audio
                num_loops = int(target_duration / video_duration) + 1
                cmd = [
                    "ffmpeg", "-y",
                    "-stream_loop", str(num_loops),
                    "-i", video_path,
                    "-i", audio_path,
                    "-t", str(target_duration),
                    "-c:v", "libx264",
                    "-preset", "medium",
                    "-crf", "23",
                    "-c:a", "aac",
                    "-b:a", "192k",
                    "-map", "0:v:0",
                    "-map", "1:a:0",
                    output_path
                ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                logger.error(f"FFmpeg error: {result.stderr}")
            
            return result.returncode == 0 and Path(output_path).exists()
            
        except Exception as e:
            logger.error(f"Error syncing video with audio: {e}")
            return False
    
    def _concatenate_videos(self, video_list: List[str], output_path: str) -> bool:
        """
        Concatenate multiple video files.
        
        Args:
            video_list: List of video file paths
            output_path: Output video path
            
        Returns:
            True if successful
        """
        if len(video_list) == 1:
            # Just rename/copy single video
            try:
                Path(video_list[0]).rename(output_path)
                return True
            except (OSError, PermissionError) as e:
                logger.warning(f"Could not rename {video_list[0]}: {e}, trying copy instead")
                try:
                    import shutil
                    shutil.copy2(video_list[0], output_path)
                    return True
                except Exception as copy_err:
                    logger.error(f"Failed to copy video: {copy_err}")
                    return False
        
        try:
            # Create concat file
            concat_file = Path(output_path).with_suffix('.concat.txt')
            with open(concat_file, 'w') as f:
                for video_file in video_list:
                    # Use absolute paths to avoid shell metacharacter issues
                    abs_path = str(Path(video_file).absolute())
                    # Escape for FFmpeg's concat demuxer (not shell)
                    # FFmpeg concat requires escaping: ', \, newlines, and #
                    escaped_path = (abs_path
                                    .replace("\\", r"\\")  # Backslashes first
                                    .replace("'", r"\'")   # Single quotes
                                    .replace("\n", r"\n")  # Newlines
                                    .replace("#", r"\#"))  # Hash (comment char)
                    f.write(f"file '{escaped_path}'\n")
            
            cmd = [
                "ffmpeg", "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", str(concat_file),
                "-c", "copy",
                output_path
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=600
            )
            
            concat_file.unlink()
            
            if result.returncode != 0:
                logger.error(f"FFmpeg concat error: {result.stderr}")
            
            return result.returncode == 0 and Path(output_path).exists()
            
        except Exception as e:
            logger.error(f"Error concatenating videos: {e}")
            return False
    
    def _get_duration(self, media_path: str) -> Optional[float]:
        """Get duration of media file in seconds."""
        if not self._check_command("ffprobe"):
            return None
        
        try:
            cmd = [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                media_path
            ]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                duration_str = result.stdout.strip()
                if duration_str:
                    return float(duration_str)
        except Exception as e:
            logger.error(f"Error getting duration: {e}")
        
        return None
    
    def _check_command(self, command: str) -> bool:
        """Check if a command is available."""
        try:
            result = subprocess.run(
                ["which", command],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
            return False
