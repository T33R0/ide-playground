# Legacy PHP Reference Files

This directory contains the original PHP files from the monolith application for reference during the MFE migration.

## Purpose
These files serve as the source of truth for:
- Business logic implementation
- API call structures (AJAX vs REST)
- Data handling patterns
- Feature functionality

## Usage
- **DO NOT** import or execute these files in the build process
- Use them as reference for rebuilding features in React/TypeScript
- Maintain the same data contracts and logic patterns
- Reference for understanding existing user workflows

## Files
Place the eight legacy PHP files here with descriptive names:
- `garage-management.php` (or original name)
- `maintenance-tracking.php` (or original name)
- `build-plans.php` (or original name)
- etc.

## Integration Notes
- These files use WordPress authentication via `get_current_user_id()`
- Database queries should be mapped to our TypeScript contracts
- API endpoints should be documented for route mapping in `routes.json`
