#!/usr/bin/env python3
"""
Visual Generator Module
Generates visual footage for video production.
"""

import os
import subprocess
import time
from pathlib import Path
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)


class VisualGenerator:
    """Generates visual footage for scenes."""
    
    def __init__(self, output_dir: str, resolution: str = "1920x1080", fps: int = 30):
        """
        Initialize the visual generator.
        
        Args:
            output_dir: Directory to save visual files
            resolution: Video resolution (e.g., "1920x1080")
            fps: Frames per second
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.resolution = resolution
        self.fps = fps
        self.width, self.height = map(int, resolution.split('x'))
        
    def generate_for_scenes(
        self,
        scenes: list,
        script_name: str,
        demo_url: Optional[str] = None,
        headless: bool = True
    ) -> list:
        """
        Generate visuals for all scenes.
        
        Uses fallback hierarchy:
        1. Demo URL capture (if provided)
        2. Local app run (if no demo URL)
        3. Diagram/visualization generation
        4. Static title cards
        
        Args:
            scenes: List of scene dictionaries
            script_name: Base name for output files
            demo_url: Optional demo URL to capture
            headless: Run browser in headless mode
            
        Returns:
            List of visual file paths
        """
        visual_files = []
        
        # Try demo capture first
        if demo_url:
            logger.info(f"Attempting demo capture from: {demo_url}")
            demo_video = self._capture_demo(demo_url, script_name, headless)
            if demo_video:
                # Use demo video for all scenes (will be split/edited later)
                for scene in scenes:
                    visual_files.append({
                        "scene_num": scene['scene_num'],
                        "path": demo_video,
                        "type": "demo_capture",
                        "duration": None  # Will be determined during assembly
                    })
                return visual_files
        
        # Generate per-scene visuals
        for scene in scenes:
            scene_num = scene['scene_num']
            heading = scene.get('heading', f'Scene {scene_num}')
            visuals = scene.get('visuals', [])
            
            logger.info(f"Generating visuals for scene {scene_num}: {heading}")
            
            # Try to generate appropriate visual
            visual_path = None
            visual_type = None
            
            # Check if scene has specific visual requirements
            if visuals:
                logger.info(f"  Visual cues: {visuals}")
                visual_path = self._generate_diagram(
                    heading, visuals, script_name, scene_num
                )
                visual_type = "diagram"
            else:
                # Generate title card
                visual_path = self._generate_title_card(
                    heading, script_name, scene_num
                )
                visual_type = "title_card"
            
            if visual_path:
                visual_files.append({
                    "scene_num": scene_num,
                    "path": visual_path,
                    "type": visual_type,
                    "duration": None
                })
                logger.info(f"  ✓ Created {Path(visual_path).name}")
            else:
                logger.error(f"  ✗ Failed to generate visual for scene {scene_num}")
        
        return visual_files
    
    def _capture_demo(
        self,
        url: str,
        script_name: str,
        headless: bool = True
    ) -> Optional[str]:
        """
        Capture demo video from URL using browser automation.
        
        Args:
            url: Demo URL to capture
            script_name: Base name for output
            headless: Run browser in headless mode
            
        Returns:
            Path to captured video file, or None if failed
        """
        output_file = self.output_dir / f"{script_name}_demo.mp4"
        
        try:
            # Check if playwright is available
            try:
                from playwright.sync_api import sync_playwright
            except ImportError:
                logger.warning("Playwright not available, skipping demo capture")
                return None
            
            logger.info("  Starting browser automation...")
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=headless)
                context = browser.new_context(
                    viewport={"width": self.width, "height": self.height},
                    record_video_dir=str(self.output_dir),
                    record_video_size={"width": self.width, "height": self.height}
                )
                page = context.new_page()
                
                # Navigate and interact
                logger.info(f"  Navigating to {url}...")
                page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Wait for page to be interactive
                time.sleep(2)
                
                # Scroll through page slowly
                logger.info("  Capturing interaction...")
                viewport_height = self.height
                total_height = page.evaluate("document.body.scrollHeight")
                scroll_steps = max(1, int(total_height / viewport_height))
                
                for i in range(scroll_steps):
                    scroll_y = i * viewport_height
                    page.evaluate(f"window.scrollTo(0, {scroll_y})")
                    time.sleep(1)
                
                # Return to top
                page.evaluate("window.scrollTo(0, 0)")
                time.sleep(1)
                
                # Close and save video
                page.close()
                context.close()
                browser.close()
                
                # Find the recorded video
                video_files = list(self.output_dir.glob("*.webm"))
                if video_files:
                    video_file = video_files[-1]
                    # Convert to mp4 if ffmpeg available
                    if self._check_command("ffmpeg"):
                        self._convert_video(str(video_file), str(output_file))
                        video_file.unlink()
                        return str(output_file)
                    else:
                        video_file.rename(output_file.with_suffix('.webm'))
                        return str(output_file.with_suffix('.webm'))
                
        except Exception as e:
            logger.error(f"  Demo capture failed: {e}")
            return None
        
        return None
    
    def _generate_diagram(
        self,
        heading: str,
        visual_cues: List[str],
        script_name: str,
        scene_num: int
    ) -> Optional[str]:
        """
        Generate diagram/visualization image.
        
        Args:
            heading: Scene heading
            visual_cues: List of visual description strings
            script_name: Base name
            scene_num: Scene number
            
        Returns:
            Path to generated image
        """
        output_file = self.output_dir / f"{script_name}_scene{scene_num:02d}_visual.png"
        
        try:
            from PIL import Image, ImageDraw, ImageFont
        except ImportError:
            logger.warning("Pillow not available, falling back to title card")
            return self._generate_title_card(heading, script_name, scene_num)
        
        try:
            # Create image
            img = Image.new('RGB', (self.width, self.height), color='#1f2937')
            draw = ImageDraw.Draw(img)
            
            # Try to load a font with fallbacks for different systems
            font_paths_heading = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux (Debian/Ubuntu)
                "/System/Library/Fonts/Helvetica.ttc",  # macOS
                "C:\\Windows\\Fonts\\arialbd.ttf",  # Windows
                "/usr/share/fonts/liberation/LiberationSans-Bold.ttf",  # RHEL/CentOS
            ]
            font_paths_text = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/System/Library/Fonts/Helvetica.ttc",
                "C:\\Windows\\Fonts\\arial.ttf",
                "/usr/share/fonts/liberation/LiberationSans-Regular.ttf",
            ]
            
            font_heading = None
            font_text = None
            
            for path in font_paths_heading:
                try:
                    font_heading = ImageFont.truetype(path, 60)
                    break
                except (OSError, IOError):
                    continue
            
            for path in font_paths_text:
                try:
                    font_text = ImageFont.truetype(path, 32)
                    break
                except (OSError, IOError):
                    continue
            
            # Fallback to default if no fonts found
            if not font_heading:
                font_heading = ImageFont.load_default()
            if not font_text:
                font_text = ImageFont.load_default()
            
            # Draw heading
            heading_bbox = draw.textbbox((0, 0), heading, font=font_heading)
            heading_width = heading_bbox[2] - heading_bbox[0]
            heading_x = (self.width - heading_width) // 2
            draw.text((heading_x, 100), heading, fill='#f9fafb', font=font_heading)
            
            # Draw visual cues
            y_offset = 250
            for i, cue in enumerate(visual_cues[:5]):  # Max 5 cues
                # Wrap text
                wrapped_text = self._wrap_text(cue, font_text, self.width - 200)
                for line in wrapped_text.split('\n'):
                    draw.text((100, y_offset), f"• {line}", fill='#10b981', font=font_text)
                    y_offset += 50
            
            # Save image
            img.save(output_file, 'PNG')
            return str(output_file)
            
        except Exception as e:
            logger.error(f"Diagram generation failed: {e}")
            return None
    
    def _generate_title_card(
        self,
        heading: str,
        script_name: str,
        scene_num: int
    ) -> Optional[str]:
        """
        Generate simple title card image.
        
        Args:
            heading: Title text
            script_name: Base name
            scene_num: Scene number
            
        Returns:
            Path to generated image
        """
        output_file = self.output_dir / f"{script_name}_scene{scene_num:02d}_title.png"
        
        # Handle None or empty heading (using ScriptParser constant)
        from .script_parser import ScriptParser
        if not heading:
            heading = ScriptParser.DEFAULT_HEADING.format(scene_num=scene_num)
        
        try:
            from PIL import Image, ImageDraw, ImageFont
        except ImportError:
            logger.error("Pillow not available, cannot generate title card")
            return None
        
        try:
            # Create image
            img = Image.new('RGB', (self.width, self.height), color='#1f2937')
            draw = ImageDraw.Draw(img)
            
            # Load font with fallbacks for different systems
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux (Debian/Ubuntu)
                "/System/Library/Fonts/Helvetica.ttc",  # macOS
                "C:\\Windows\\Fonts\\arialbd.ttf",  # Windows
                "/usr/share/fonts/liberation/LiberationSans-Bold.ttf",  # RHEL/CentOS
            ]
            
            font = None
            for path in font_paths:
                try:
                    font = ImageFont.truetype(path, 72)
                    break
                except (OSError, IOError):
                    continue
            
            if not font:
                font = ImageFont.load_default()
            
            # Draw centered text
            wrapped_text = self._wrap_text(heading, font, self.width - 200)
            
            # Calculate total height
            lines = wrapped_text.split('\n')
            line_heights = [draw.textbbox((0, 0), line, font=font)[3] for line in lines]
            total_height = sum(line_heights) + (len(lines) - 1) * 20
            
            # Draw each line centered
            y_offset = (self.height - total_height) // 2
            for line in lines:
                bbox = draw.textbbox((0, 0), line, font=font)
                text_width = bbox[2] - bbox[0]
                x = (self.width - text_width) // 2
                draw.text((x, y_offset), line, fill='#f9fafb', font=font)
                y_offset += bbox[3] + 20
            
            # Save image
            img.save(output_file, 'PNG')
            return str(output_file)
            
        except Exception as e:
            logger.error(f"Title card generation failed: {e}")
            return None
    
    def _wrap_text(self, text: str, font, max_width: int) -> str:
        """Wrap text to fit within max_width."""
        try:
            from PIL import ImageDraw
            draw = ImageDraw.Draw(Image.new('RGB', (1, 1)))
            
            words = text.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = draw.textbbox((0, 0), test_line, font=font)
                width = bbox[2] - bbox[0]
                
                if width <= max_width:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            
            if current_line:
                lines.append(' '.join(current_line))
            
            return '\n'.join(lines)
        except:
            # Fallback: simple character-based wrapping
            max_chars = max_width // 10
            words = text.split()
            lines = []
            current_line = ""
            
            for word in words:
                if len(current_line) + len(word) + 1 <= max_chars:
                    current_line += (" " if current_line else "") + word
                else:
                    if current_line:
                        lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            return '\n'.join(lines)
    
    def _convert_video(self, input_path: str, output_path: str) -> bool:
        """Convert video format using FFmpeg."""
        try:
            cmd = [
                "ffmpeg", "-y", "-i", input_path,
                "-c:v", "libx264", "-preset", "medium",
                "-crf", "23", "-c:a", "aac",
                output_path
            ]
            result = subprocess.run(cmd, capture_output=True, timeout=300)
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Video conversion failed: {e}")
            return False
    
    def _check_command(self, command: str) -> bool:
        """Check if a command is available."""
        try:
            result = subprocess.run(
                ["which", command],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except:
            return False
