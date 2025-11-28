# TODO

Development tasks and ideas for HeureDeVol.

## In Progress

- [ ] Define and implement logging strategy
  - Logger utility abstraction (dev vs prod)
  - Remove hardcoded console logs from database layer

## Planned

- [ ] Error handling infrastructure
  - React Error Boundaries (root + feature-level)
  - Error transformation utilities
  - User-facing error display (toast notifications)
  - Choose toast library (sonner vs react-hot-toast)

## Ideas / Future Enhancements

- [ ] Structured logging with context
- [ ] Error recovery mechanisms (retry logic, etc.)
- [ ] Error monitoring service integration if project scales (Sentry, etc.)

## Notes

- Logging strategy: technical logs (dev only) vs user-facing messages (always)
- Exception pattern: let errors bubble up, catch only where needed
- Error boundaries catch rendering errors, not event handlers or async code
