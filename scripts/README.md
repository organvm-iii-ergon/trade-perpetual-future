# Scripts Directory

Automation and utility scripts for the trade-perpetual-future repository.

## Available Scripts

### Video Production Agent

**Location**: `video-production-agent.sh`

Autonomous video production system that generates finished MP4 videos from repository scripts.

**Quick Start**:
```bash
./scripts/video-production-agent.sh
```

**Features**:
- Automatic script discovery and parsing
- Local text-to-speech narration
- Visual generation (demo capture, diagrams, title cards)
- Audio-visual synchronization
- MP4 rendering with FFmpeg

**Documentation**:
- `video_production/README.md` - Full technical documentation
- `video_production/EXAMPLES.md` - Usage examples and best practices

**Use Cases**:
- Generate portfolio videos from hiring-portfolio scripts
- Create walkthrough videos for demos
- Produce presentation materials for non-technical audiences

## Directory Structure

```
scripts/
├── README.md                        # This file
├── video-production-agent.sh        # Main entry point
└── video_production/                # Video production modules
    ├── README.md                    # Technical documentation
    ├── EXAMPLES.md                  # Usage examples
    ├── requirements.txt             # Python dependencies
    ├── orchestrator.py              # Main coordinator
    ├── script_scanner.py            # Script discovery
    ├── script_parser.py             # Scene extraction
    ├── audio_generator.py           # TTS narration
    ├── visual_generator.py          # Visual creation
    └── video_assembler.py           # Video compilation
```

## Requirements

### System Dependencies
- Python 3.8+
- FFmpeg
- espeak-ng (or alternative TTS engine)

### Python Dependencies
Automatically installed by the agent:
- pyttsx3, gtts (TTS)
- playwright (browser automation)
- Pillow (image processing)
- moviepy (video processing)

## Quick Examples

### Generate all portfolio videos
```bash
./scripts/video-production-agent.sh
```

### Generate specific script
```bash
export SCRIPT_PATTERN="EXECUTIVE_SUMMARY.md"
./scripts/video-production-agent.sh
```

### With demo URL capture
```bash
export DEMO_URL="https://your-demo.com"
./scripts/video-production-agent.sh
```

### High-resolution output
```bash
export VIDEO_RESOLUTION="3840x2160"
export FPS="60"
./scripts/video-production-agent.sh
```

## Output

Videos are saved to `video_output/` with the following structure:

```
video_output/
├── ScriptName.mp4           # Final videos
├── audio/                   # Intermediate audio
├── visuals/                 # Intermediate visuals
└── logs/                    # Production logs
```

## Adding New Scripts

Future automation scripts should be added here following these conventions:

1. **Naming**: Use kebab-case (e.g., `deploy-docs.sh`)
2. **Permissions**: Make executable with `chmod +x`
3. **Documentation**: Add usage info to this README
4. **Dependencies**: Document in script header or requirements file
5. **Error handling**: Exit with appropriate codes (0 = success, 1+ = error)

## Contributing

When adding new scripts:
1. Test thoroughly in isolation
2. Document environment variables and flags
3. Add example usage
4. Include error handling and logging
5. Update this README

## Support

For issues with video production:
- Check logs in `video_output/logs/`
- Review documentation in `video_production/README.md`
- See examples in `video_production/EXAMPLES.md`

For other scripts:
- Check script header for usage info
- Review error messages and exit codes
