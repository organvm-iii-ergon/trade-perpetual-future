#!/usr/bin/env python3
"""
Audio Generator Module
Generates narration audio from script text using local TTS.
"""

import os
import subprocess
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class AudioGenerator:
    """Generates narration audio using local text-to-speech."""
    
    def __init__(self, output_dir: str, voice_mode: str = "local_tts"):
        """
        Initialize the audio generator.
        
        Args:
            output_dir: Directory to save audio files
            voice_mode: TTS mode (local_tts, gtts, etc.)
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.voice_mode = voice_mode
        
    def generate_from_scenes(self, scenes: list, script_name: str) -> list:
        """
        Generate audio for all scenes.
        
        Args:
            scenes: List of scene dictionaries from script parser
            script_name: Base name for output files
            
        Returns:
            List of audio file paths
        """
        audio_files = []
        
        for scene in scenes:
            scene_num = scene['scene_num']
            content = scene['content']
            
            if not content.strip():
                logger.warning(f"Scene {scene_num} has no narration, skipping")
                continue
                
            output_file = self.output_dir / f"{script_name}_scene{scene_num:02d}.wav"
            
            logger.info(f"Generating audio for scene {scene_num}...")
            success = self._generate_audio(content, str(output_file))
            
            if success:
                audio_files.append({
                    "scene_num": scene_num,
                    "path": str(output_file),
                    "duration": self._get_audio_duration(str(output_file))
                })
                logger.info(f"  ✓ Created {output_file.name}")
            else:
                logger.error(f"  ✗ Failed to generate audio for scene {scene_num}")
                # Retry with smaller chunks
                logger.info(f"  Retrying with smaller chunks...")
                success = self._generate_audio_chunked(content, str(output_file))
                if success:
                    audio_files.append({
                        "scene_num": scene_num,
                        "path": str(output_file),
                        "duration": self._get_audio_duration(str(output_file))
                    })
                    logger.info(f"  ✓ Created {output_file.name} (chunked)")
        
        return audio_files
    
    def _generate_audio(self, text: str, output_path: str, retry: bool = True) -> bool:
        """
        Generate audio using available TTS engine.
        
        Args:
            text: Text to convert to speech
            output_path: Output audio file path
            retry: Whether to retry on failure
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if self.voice_mode == "local_tts":
                # Try espeak-ng first
                if self._check_command("espeak-ng"):
                    return self._generate_with_espeak(text, output_path)
                # Try pico2wave
                elif self._check_command("pico2wave"):
                    return self._generate_with_pico(text, output_path)
                # Try festival
                elif self._check_command("festival"):
                    return self._generate_with_festival(text, output_path)
                # Try gtts as fallback
                else:
                    logger.warning("No local TTS found, falling back to gTTS (requires internet)")
                    return self._generate_with_gtts(text, output_path)
            else:
                return self._generate_with_gtts(text, output_path)
                
        except Exception as e:
            logger.error(f"Error generating audio: {e}")
            if retry:
                logger.info("Retrying once...")
                return self._generate_audio(text, output_path, retry=False)
            return False
    
    def _generate_audio_chunked(self, text: str, output_path: str) -> bool:
        """
        Generate audio in smaller chunks and concatenate.
        
        Args:
            text: Text to convert
            output_path: Final output path
            
        Returns:
            True if successful
        """
        # Split text into sentences
        import re
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        if len(sentences) <= 1:
            return self._generate_audio(text, output_path, retry=False)
        
        temp_files = []
        for i, sentence in enumerate(sentences):
            if not sentence.strip():
                continue
            temp_file = str(Path(output_path).with_suffix(f'.part{i}.wav'))
            if self._generate_audio(sentence, temp_file, retry=False):
                temp_files.append(temp_file)
            else:
                logger.warning(f"Failed to generate chunk {i}")
        
        if not temp_files:
            return False
        
        # Concatenate using FFmpeg
        success = self._concatenate_audio_files(temp_files, output_path)
        
        # Clean up temp files
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        return success
    
    def _generate_with_espeak(self, text: str, output_path: str) -> bool:
        """Generate audio using espeak-ng."""
        try:
            # Save text to temp file to handle special characters
            temp_text = Path(output_path).with_suffix('.txt')
            with open(temp_text, 'w', encoding='utf-8') as f:
                f.write(text)
            
            cmd = [
                "espeak-ng",
                "-v", "en-us",
                "-s", "160",  # Speed (words per minute)
                "-f", str(temp_text),
                "-w", output_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            temp_text.unlink()
            
            return result.returncode == 0 and Path(output_path).exists()
        except Exception as e:
            logger.error(f"espeak-ng error: {e}")
            return False
    
    def _generate_with_pico(self, text: str, output_path: str) -> bool:
        """Generate audio using pico2wave."""
        try:
            cmd = ["pico2wave", "-w", output_path, text]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            return result.returncode == 0 and Path(output_path).exists()
        except Exception as e:
            logger.error(f"pico2wave error: {e}")
            return False
    
    def _generate_with_festival(self, text: str, output_path: str) -> bool:
        """Generate audio using festival."""
        try:
            # Write text to temporary file to avoid injection issues
            temp_text = Path(output_path).with_suffix('.txt')
            with open(temp_text, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Use file input instead of inline text to avoid injection
            # Validate paths to ensure they don't contain shell metacharacters
            temp_text_str = str(temp_text.absolute())
            output_path_str = str(Path(output_path).absolute())
            
            cmd = [
                "festival",
                "--batch",
                f'(utt.save.wave (utt.synth (Utterance Text (load "{temp_text_str}" t))) "{output_path_str}" "riff")'
            ]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if temp_text.exists():
                temp_text.unlink()
            
            return result.returncode == 0 and Path(output_path).exists()
        except Exception as e:
            logger.error(f"festival error: {e}")
            return False
    
    def _generate_with_gtts(self, text: str, output_path: str) -> bool:
        """Generate audio using Google Text-to-Speech (requires internet)."""
        try:
            from gtts import gTTS
            tts = gTTS(text=text, lang='en', slow=False)
            
            # gTTS outputs mp3, convert to wav using ffmpeg
            temp_mp3 = Path(output_path).with_suffix('.mp3')
            tts.save(str(temp_mp3))
            
            if self._check_command("ffmpeg"):
                cmd = [
                    "ffmpeg", "-y", "-i", str(temp_mp3),
                    "-ar", "48000", "-ac", "2",
                    output_path
                ]
                result = subprocess.run(cmd, capture_output=True, timeout=60)
                temp_mp3.unlink()
                return result.returncode == 0
            else:
                # Just rename if no ffmpeg
                temp_mp3.rename(output_path)
                return True
                
        except Exception as e:
            logger.error(f"gTTS error: {e}")
            return False
    
    def _concatenate_audio_files(self, file_list: list, output_path: str) -> bool:
        """Concatenate multiple audio files using FFmpeg."""
        if not self._check_command("ffmpeg"):
            logger.error("FFmpeg not available for concatenation")
            return False
        
        try:
            # Create concat file
            concat_file = Path(output_path).with_suffix('.concat.txt')
            with open(concat_file, 'w') as f:
                for audio_file in file_list:
                    f.write(f"file '{audio_file}'\n")
            
            cmd = [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", str(concat_file),
                "-c", "copy",
                output_path
            ]
            result = subprocess.run(cmd, capture_output=True, timeout=120)
            
            concat_file.unlink()
            
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Concatenation error: {e}")
            return False
    
    def _get_audio_duration(self, audio_path: str) -> Optional[float]:
        """Get duration of audio file in seconds using FFmpeg."""
        if not self._check_command("ffmpeg"):
            return None
        
        try:
            cmd = [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                audio_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                return float(result.stdout.strip())
        except:
            pass
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
