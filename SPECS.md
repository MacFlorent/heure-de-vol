# HeureDeVol - Specifications

## Document function

This document describes the HeureDeVol (hdv) application.
The application is not done yet, so this document describes what the application aims to be:
- Not everything is done
- It will evolve as new ideas emerge or are abandonned
- It is not a roadmap

## Project Vision

HeureDeVol (hdv) is a pilot logbook application supporting both real-world and virtual (flight simulator) aviation. The application tracks flight data in a client-side data storage, with export and import functionnalities allowing portability and persistance at the user discretion.

**Main functionalities**:
- Mono-user but multi-logbook capability
- Flights are at the core of the application a regroup all relevant data
- Flights are attached to a logbook
- Flights are easy and quick to input, and can be amended or deleted if required
- Flight data is lightly customizable at the logbook level
- Master data are limited to Aircraft Types and can be easily expanded while creating a flight
- Dashboards and statistics pages display pilot currency, aircraft experience, qualifications tracking or general statistics
- All data can be exported to and imported from adhoc JSON files
- Flight data can be imported into a logbook from pre-existing or external files of different formats

**Target Users**:

- Private pilots tracking flight hours for currency and ratings
- Flight simulation enthusiasts (DCS, MSFS, X-Plane)
- Student pilots building experience
- Pilots managing multiple aircraft types and qualifications

## General application structure

```
HeureDeVol data (for one user)
├── Application Settings         # General application settings
├── Master Data                  # General data shared between all logbooks
│   └── Aircraft types           # Collection or aircraft types usable in the flights
│       └── Aircraft type        # One aircraft type of the collection, e.g "PA-19" or "DR-42"
└── Logbooks                     # Collection of logbooks
    └── Logbook                  # One logbook of the collection, e.g "Real Aviation", "DCS Combat"
        ├── Options              # Logbook options, display preferences and flight fields configuration
        └── Flights              # Collection of flights in this logbook
            └── Flight           # On flight of the collection
```

## Data Structure

The data is stored in a local database (IndexedDB). It is mono-user with client-side storage only. Export/import to user specific files (xlsx, csv, local or cloud based) is possible.  
The application is built around collections of flights stored in logbooks. It allows for multiple pilot logbooks to be maintained in the same database. A logbook offers customization to account for specific requirements (real world vs simulation or military simulation).

To model this structure, the HeureDeVol local database (IndexedDB) houses the following data stores.  
Times (durations) are stored as decimal hours with 2 decimal places.  
Dates are stored as Javascript date objects. No timezone management, only dates as input by the user.
Identifiers used as foreign keys are stored as UUID strings. Identifiers not used as foreign keys are auto-increment numbers.

| Data store | Key path | Description
| ---- | ---- | -----------
| appSettings | id (string) | Application-wide settings. Only a singleton record (id="default")
| aircraftType | id (UUID) | Collection of aircraft types
| logbook | id (UUID) | Collection of logbooks
| flight | id (number) | Collection of all flight records across all logbooks

Identifiers used as foreign key references are UUID (import/export stability).
Identifiers only used a primary kets (flight id) use auto-increment.
Identifiers for singleton datastores are strings.

### First-Run Initialization

On first app launch (empty database):
- Create default logbook with id=UUID, name="My Logbook"
- Create default settings record with id='default'
- Store default logbook id in settings.defaultLogbookId

### Settings

IndexedDB Object Store: `appSettings`

| Data | Type | Description | Example
| ---- | ---- | ----------- | -------
| id | string | Key path identifier | default
| language | string | UI language preference | english
| units | string | Time display as decimal or hour:minutes | decimal
| theme | string | Light/dark mode | dark
| defaultLogbookId | UUID | Default logbook to open | 6c3d3837-007f-48e4-a7fb-fc5962bead82

### Aircraft type

IndexedDB Object Store: `aircraftType`

| Data | Type | Description | Example
| ---- | ---- | ----------- | -------
| id | UUID | Key path identifier | fdf342f2-739e-46d2-9f46-42aec5d952bf
| type | string | Short type description | PA-19
| icao | string | ICAO type | PA-18
| name | string | Long type description | PIPER PA-19/L-18C Super Cub
| vp | boolean | Variable pitch | false
| ru | boolean | Retractable undercarriage | false
| me | boolean | Multi-engine | false
| tw | boolean | Tailwheel | true
| hp | boolean | High performance aircraft (>200 HP) | false

**Required Fields**:
- `type` - Non-empty
- `name` - Non-empty

**Aircraft Characteristics**:
- **EASA/Europe**: Tracks VP (Variable Pitch) and RU (Retractable Undercarriage) **separately**
- **FAA/US**: Combines into "Complex" (RG + VP + flaps) and "High-Performance" (>200 HP)
- Here we have all details required to identify aircraft characteristics for both systems (Complex=VP or RU)

### Logbook

IndexedDB Object Store: `logbook`

| Data | Type | Description | Example
| ---- | ---- | ----------- | -------
| id | UUID | Key path identifier | 375addaf-3cf0-438c-8bd7-7789974dd771
| name | string | User-chosen name | "Real Aviation", "DCS Combat"
| description | string | Optional longer description | PA-18
| created | date | Creation date | 10/10/2025 15:38
| flightFields | object | Logbook-specific field display customization | timeDualReceived: false, timeCustom2: false
| flightFieldsCustom | object | Logbook-specific custom field names | timeCustom1: "Formation flying", counterCustom1: "Carrier traps"

**Required Fields**:
- `name` - Non-empty

### Flight

IndexedDB Object Store: `flight`  
Each Flight belongs to one Logbook via `logbookId` field  
Each Flight references an aircraft type via `aircraftTypeId` field
Indexed by:
- `logbookId` - Essential for querying all flights in a specific logbook
- `date`
- `aircraftTypeId` - For aircraft-specific totals and statistics
- `logbookId` and `date` - Compound index for efficient date-range queries within a logbook

| Data | Type | Description | Example
| ---- | ---- | ----------- | -------
| id | number | Key path identifier, auto-increment | 57
| logbookId | UUID | References parent logbook.id | 375addaf-3cf0-438c-8bd7-7789974dd771
| date | date | Flight date | 28/10/2025
| aircraftTypeId | UUID | References flown aircraftType.id | fdf342f2-739e-46d2-9f46-42aec5d952bf
| aircraftRegistration | string | Aircraft registration (free input) | F-BOUZ
| description | string | Flight description | Traffic patterns @ LFPZ
| timeTotal | number | Total flight time | 1.1
| timePic | number | Flight time as pilot in command | 1.1
| timeDualInstructed | number | Flight time as instructor dispensing instruction | 0
| timeDualReceived | number | Flight time as student receiving instruction | 0
| timeSoloSupervised | number | Flight time as student authorized for solo flying | 0
| timeNight | number | Flight time at night | 0
| timeCrossCountry | number | Flight time cross country (>50nm from departure) | 1.1
| timeIfrSimulated | number | Flight time in simulated IFR conditions (hood/foggles) | 0
| timeIfrActual | number | Flight time in actual IFR conditions (IMC) | 0
| timeCustom1 | number | Custom time configured at logbook level | 0
| timeCustom2 | number | Custom time configured at logbook level | 0
| landingsDay | number | Day landings or touch-and-go | 7
| landingsNight | number | Night landings (full-stop) | 0
| counterCustom1 | number | Custom counter configured at logbook level | 0
| counterCustom2 | number | Custom counter configured at logbook level | 0
| remarks | string | Additionnal remarks | Crosswind training, no ATC

**Required Fields**:
- `date` - Cannot be future date
- `aircraftTypeId` - Non-empty
- `aircraftRegistration` - Non-empty
- `timeTotal` - Must be > 0

**Business rules**:
- `timePic + timeDualReceived + timeSoloSupervised ≤ timeTotal`
- `timeNight ≤ timeTotal`
- `timeIfrActual + timeIfrSimulated ≤ timeTotal`
- `timeCrossCountry ≤ timeTotal`
- All time category fields cannot exceed `timeTotal`
- `landingsNight` should only be logged when flight includes night time

### Data integrity rules

  - aircraftType deletion: prevent if flights exist
  - logbook deletion: RESTRICT with warning showing flight count
  
## Ergonomy

### Input Methods

**Date Entry**:
- Date picker with keyboard shortcut (defaults to today)
- Cannot select future dates

**Aircraft Type Entry**:
- Selection from Master Data Aircraft Type data store
- Option to quickly add an Aircraft Type without breaking the current input flow

**Time Entry**:
- Allow input as decimal hours with 2 decimals (1.5, 2.25), or as hour:minutes (1:30, 2:15)
- Underlying time data and storage is always decimal hours

**Numeric Fields**:
- Landings, approaches, carrier traps, kills
- Min: 0, increment: 1
- Show +/- buttons

### Form Validation

**Client-Side Validation**:
- Required field indicators
- Inline error messages
- Field-level validation on blur
- Form-level validation on submit
- Disable submit button until valid

### Main menu

The main menu gives access to the main application functions:

```
Main menu
├── Quick logbook selection     # Selectable list of logbooks, displays the active logbook
├── Homepage                    # Displays the Homepage form
├── New flight                  # Displays the Flight Detail Popup in creation mode
├── Flights                     # Displays the Flights List form
├── Statistics                  # Displays the Statistics form
└── Options                     # Opens a sub-menu
    ├── Settings                # Displays the Application Settings form
    ├── Logbooks                # Displays the Logbooks form
    └── Export & import         # Displays the Export/Import form
```

### Homepage

Shows recent flights, current currencies, quick stats for active logbook.

### Flight Detail Popup

This form is displayed as a modal popup is the unitary flight data display. It presents all the fields relevant to a flight in the customized context of the active logbook.  
It can be presented in three modes:
- Creation
- Consultation/modification
- Deletion

### Flights List

This form displays a list (a datagrid) of all the flights for the active logbook. It also allows to:
- Access the detail of a selected flight with the Flight Detail Popup
- Delete a flight

**Filter Criteria**:
- Date range (from/to)
- Aircraft type
- Aircraft category/class
- Flight type (PIC, dual, solo, IFR)

**Sorting Options**:
- Date (newest/oldest first)
- Total time (longest/shortest first)
- Aircraft type (alphabetical)

### Statistics

This form displays statistics and pilot qualifications currencies based on the flights of the active logbook.

**90-Day Passenger Currency (Real Aircraft)**:
- 3 takeoffs and landings in preceding 90 days
- Same category and class of aircraft
- For night passengers: 3 night landings (full-stop) in preceding 90 days

**Qualification Tracking**:
- Medical certificate (class + expiration)
- Flight review (every 24 calendar months)
- Endorsements with expiration dates
- Type ratings
- Instrument rating currency

**General statistics**
- Total flight hours
- Totals by category, by period, by aircraft type

### Application Settings

This form displays application level settings:
- Display units choice
- Language
- Dark or light theme

### Logbooks

This form displays a list (a datagrid) of all the logbooks. It also allows to:
- Mark a logbook as default
- Activate a logbook
- Display and amend the detail of a selected logbook with the Logbook Detail Popup
- Delete a logbook

### Logbook Detail Popup

This form is displayed as a modal popup to display the data of a logbook. It presents all the fields relevant to the logbook.  
It can be presented in three modes:
- Creation
- Consultation/modification
- Deletion

### Export/Import

This form gives access to Export/Import functions:
- Export to or import from adhoc JSON file
- Import from custom csv, JSON or Excel files
- Setup clound synchronisation

## Logbook customization

Logbook customization allows to hide or display certain flight data fields (time and counters). Only predetermined fields can be customized.  
When creating a new logbook, the customizable fields are initialized as default. The configuration can then be amended at any time by the user.

**Custom field names**:  among the customizable fields are un-named data fields that, if activated for the logbook, can be custom named to reflect a specific need:
- Times - e.g "formation flying", "over sea", "low level flying"
- Counters - e.g "a/a refuelings", "ifr approaches", "carrier traps"

**List of customizable fields**:

| Customizable field | Default visibility | Customizable name | Default name
| ---- | ---- | ---- | ----
| timeDualInstructed | false | false
| timeDualReceived | true | false
| timeSoloSupervised | true | false
| timeNight | true | false
| timeIfrSimulated | false | false
| timeIfrActual | false | false
| timeCustom1 | false | true | Custom time 1
| timeCustom2 | false | true | Custom time 2
| counterCustom1 | false | true | Custom counter 1
| counterCustom2 | false | true | Custom counter 2

## Export/Import

Given IndexedDB's browser-specific and device-specific isolation, export/import functionality is critical for:
- **Multi-device usage**: Access data across different devices
- **Browser migration**: Move from Chrome to Firefox, etc.
- **Data backup**: Protection against accidental browser data deletion
- **Device replacement**: Transfer data to new computer/phone
- **Long-term archival**: Preserve logbook data independently of browser storage

### Adhoc JSON format

All data from the application database can be exported to a specifically formatted JSON file.
- Full data fidelity (all fields preserved)
- Easy import back into application

**Import Modes**: Such a file can be imported back in the database in a delete and replace all capacity (no partial or incremental import).

### Additionnal formats

The application also proposes flat CSV or Excel type management for the flights of a logbook. These Export/Import can be adjusted by the user to be adapted to specific external requirements (pre-existing logbooks, other application formats).  
Only the flights of one logbook can be exported or imported in that way. Foreign keys are replaced by the descriptor of the pointed data store (e.g aircraftTypeId will be exported as the Aircraft Type "type" field).

**Import Modes**:
- **Merge**: Add imported flights to existing logbook (skip duplicates)
- **Replace**: Clear current logbook and import (with confirmation)

**Duplicate Detection**:
- Match on: `date + aircraftType + aircraftRegistration + timeTotal`
- Show conflicts to user for resolution
- Option to update existing or skip

### Cloud Synchronisation

**Supported Providers** (OAuth 2.0 authentication):
1. **Google Drive** (Priority 1)
   - Store `logbook.json` in app-specific folder
   - Use Google Drive API for read/write
   - No user file management required
2. **Dropbox** (Priority 2)
   - Similar API integration
3. **OneDrive** (Priority 3)
   - Microsoft cloud option

**Cloud Sync Strategy**: Manual Sync with Location Tracking:
- On app load: Check if cloud file is newer → prompt to import
- On flight add/edit/delete: Auto-export to cloud if `autoSync` enabled
- User can manually trigger "Sync Now" button
- Show sync status indicator in UI

**Retained Approach**: Start with Option A (manual sync with auto-export), evolve to Option B

### Database Schema Additions

IndexedDB Object Store: `cloudSync`

| Data | Type | Description | Example
| ---- | ---- | ----------- | -------
| id | string | Key path identifier | default
| enabled | boolean | Indicates if the cloud synchronisation is enabled | true
| provider | string | Cloud provider | google-drive
| fileId | string | Provider's file identifier |
| fileName | string | User-friendly name | logbook.json
| lastSyncDate | date | Last successful sync | 
| lastExportDate | date | Last export timestamp | 
| autoExport | boolean | Auto-export on changes | false
| autoImportCheck | boolean | Check for updates on startup | true
| syncInterval | number | Auto-sync interval (minutes) | 5

## Annexes

### Data Security & Privacy

**Data Encryption**:
- Data stored client-side (IndexedDB)
- External synchronized files stored in cloud are JSON (unencrypted)
- User controls cloud access via OAuth (can revoke anytime)

**OAuth Scopes for cloud sync**:
- Request minimal scopes (e.g., Drive: `drive.file` not `drive` full access)
- Only access app-created files, not user's entire cloud storage

**Privacy**:
- Cloud sync is **opt-in** (disabled by default)
- Clear disclosure: "Your logbook will be stored in your Google Drive"
- No telemetry or analytics on exported data
- User owns their data completely

### Technical Constraints

**Browser Compatibility**:
- Modern browsers with IndexedDB support (Chrome, Firefox, Safari, Edge)
- No IE11 support required
- No telemetry or analytics

**Performance Targets**:
- Support 10,000+ flight records without lag
- Form submission < 100ms
- Query/filter results < 500ms
- Lazy loading for large datasets

**Accessibility**:
- WCAG 2.1 Level AA compliance
- Keyboard navigation for all forms
- Screen reader compatibility
- High contrast mode support

### Open Questions / Decisions Needed
**Cloud conflict resolution**: How to handle conflicts when both local and cloud have changes? Show diff UI? Last-write-wins? Let user choose?
**Client-Side Encryption**: Should cloud-stored files be encrypted before upload? Trade-off: security vs complexity and key management

## References

- [FAA Pilot Logbook Requirements](https://www.faa.gov/licenses_certificates/airmen_certification/media/ac_61-65h.pdf)
- [EASA Flight Time Limitations](https://www.easa.europa.eu/en/domains/commercial-air-transport/flight-time-limitations)
- Standard logbook formats: Jeppesen, ASA, ForeFlight
