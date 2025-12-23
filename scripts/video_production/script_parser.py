#!/usr/bin/env python3
"""
Script Parser Module
Parses video production scripts to extract structure, scenes, and timing.
"""

import re
from pathlib import Path
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class ScriptParser:
    """Parses scripts and extracts scene structure."""
    
    # Shared constants
    VISUAL_CUE_PATTERN = r'\[(?:ON SCREEN|VISUAL|SHOT\s+[A-Za-z0-9]+):\s*([^\]]+)\]'
    DEFAULT_HEADING = "Scene {scene_num}"
    
    def __init__(self, script_path: str):
        """
        Initialize the parser.
        
        Args:
            script_path: Path to the script file
        """
        self.script_path = Path(script_path)
        self.content = ""
        self.scenes = []
        
    def load(self) -> bool:
        """
        Load the script file.
        
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            with open(self.script_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
            logger.info(f"Loaded script: {self.script_path.name} ({len(self.content)} chars)")
            return True
        except Exception as e:
            logger.error(f"Error loading script: {e}")
            return False
            
    def parse(self) -> List[Dict]:
        """
        Parse the script into scenes.
        
        Detects:
        1. Timestamp markers [00:00-00:30] or [00:00]
        2. Section headings (### or ## markers)
        3. Scene markers ([ON SCREEN:], [VISUAL:], etc.)
        4. Paragraph breaks (conservative fallback)
        
        Returns:
            List of scene dictionaries with:
            - scene_num: Scene number
            - start_time: Optional start timestamp
            - end_time: Optional end timestamp
            - heading: Optional section heading
            - content: Scene narration text
            - visuals: List of visual cues
        """
        if not self.content:
            logger.error("No content loaded. Call load() first.")
            return []
            
        scenes = []
        scene_num = 1
        
        # Try to detect structured scenes first
        # Pattern 1: Timecoded sections like ### **[00:00-00:30] THE PROBLEM**
        timecode_pattern = r'###?\s*\*?\*?\[(\d{2}:\d{2})(?:-(\d{2}:\d{2}))?\]\s*(.*?)\*?\*?'
        matches = list(re.finditer(timecode_pattern, self.content, re.MULTILINE))
        
        if matches:
            logger.info(f"Found {len(matches)} timecoded sections")
            for i, match in enumerate(matches):
                start_time = match.group(1)
                end_time = match.group(2) if match.group(2) else None
                heading = match.group(3).strip()
                
                # Extract content until next section or end
                start_pos = match.end()
                if i < len(matches) - 1:
                    end_pos = matches[i + 1].start()
                else:
                    end_pos = len(self.content)
                    
                section_content = self.content[start_pos:end_pos].strip()
                
                # Extract visual cues and narration
                visuals = self._extract_visual_cues(section_content)
                narration = self._extract_narration(section_content)
                
                scenes.append({
                    "scene_num": scene_num,
                    "start_time": start_time,
                    "end_time": end_time,
                    "heading": heading,
                    "content": narration,
                    "visuals": visuals
                })
                scene_num += 1
                
        else:
            # Pattern 2: Section headings without timecodes
            heading_pattern = r'^###?\s+(.+)$'
            lines = self.content.split('\n')
            current_heading = None
            current_content = []
            
            for line in lines:
                heading_match = re.match(heading_pattern, line)
                if heading_match:
                    # Save previous section if exists
                    if current_content:
                        narration = '\n'.join(current_content).strip()
                        if narration:
                            visuals = self._extract_visual_cues(narration)
                            clean_narration = self._extract_narration(narration)
                            scenes.append({
                                "scene_num": scene_num,
                                "start_time": None,
                                "end_time": None,
                                "heading": current_heading,
                                "content": clean_narration,
                                "visuals": visuals
                            })
                            scene_num += 1
                    
                    # Start new section
                    current_heading = heading_match.group(1).strip()
                    current_content = []
                else:
                    current_content.append(line)
            
            # Add final section
            if current_content:
                narration = '\n'.join(current_content).strip()
                if narration:
                    visuals = self._extract_visual_cues(narration)
                    clean_narration = self._extract_narration(narration)
                    scenes.append({
                        "scene_num": scene_num,
                        "start_time": None,
                        "end_time": None,
                        "heading": current_heading,
                        "content": clean_narration,
                        "visuals": visuals
                    })
            
            if not scenes:
                # Fallback: Split by paragraph breaks
                logger.info("No structured sections found, using paragraph breaks")
                paragraphs = re.split(r'\n\s*\n', self.content)
                for para in paragraphs:
                    para = para.strip()
                    if para and len(para) > 50:  # Ignore very short paragraphs
                        visuals = self._extract_visual_cues(para)
                        narration = self._extract_narration(para)
                        scenes.append({
                            "scene_num": scene_num,
                            "start_time": None,
                            "end_time": None,
                            "heading": self.DEFAULT_HEADING.format(scene_num=scene_num),
                            "content": narration,
                            "visuals": visuals
                        })
                        scene_num += 1
        
        self.scenes = scenes
        logger.info(f"Parsed {len(scenes)} scene(s)")
        return scenes
    
    def _extract_visual_cues(self, text: str) -> List[str]:
        """Extract visual cues like [ON SCREEN:], [VISUAL:], [SHOT X:], etc."""
        matches = re.findall(self.VISUAL_CUE_PATTERN, text, re.IGNORECASE)
        return [m.strip() for m in matches]
    
    def _extract_narration(self, text: str) -> str:
        """
        Extract narration text, removing visual cues and markdown.
        Preserves quoted speech indicated by > markers.
        """
        # Remove visual cues (using shared pattern constant)
        text = re.sub(self.VISUAL_CUE_PATTERN, '', text, flags=re.IGNORECASE)
        
        # Extract quoted narration (lines starting with >)
        lines = text.split('\n')
        narration_lines = []
        for line in lines:
            line = line.strip()
            if line.startswith('>'):
                # Remove the > marker and any leading/trailing quotes
                line = line[1:].strip()
                line = line.strip('"')
                narration_lines.append(line)
            elif line and not line.startswith('#') and not line.startswith('**'):
                # Include non-heading, non-bold text
                if not re.match(r'^\*\*.*\*\*:?$', line):  # Skip bold-only lines
                    narration_lines.append(line)
        
        return ' '.join(narration_lines)
    
    def get_total_word_count(self) -> int:
        """Get total word count of all narration."""
        total = sum(len(scene['content'].split()) for scene in self.scenes)
        return total
    
    def estimate_duration(self, words_per_minute: int = 150) -> float:
        """
        Estimate total video duration in seconds.
        
        Args:
            words_per_minute: Speaking pace (default 150 WPM)
            
        Returns:
            Estimated duration in seconds
        """
        word_count = self.get_total_word_count()
        minutes = word_count / words_per_minute
        return minutes * 60
