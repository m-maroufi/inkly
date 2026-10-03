# Inkly Project Context

> Updated project context document with previous architecture decisions
> added. This document describes the repository state after the latest
> audit.

# Previous Architecture Decisions

## Authentication Decisions

-   Google OAuth was removed from the current authentication plan.
-   Current authentication direction:
    -   Email + Password authentication
    -   Phone OTP may be considered later
-   JWT access tokens are used for short-lived authentication.
-   Refresh tokens are persisted securely and designed around rotation.

## Blog Architecture Decisions

-   The blog system follows a modular backend architecture.
-   Posts are designed around the workflow:

``` text
Draft → Admin Review → Publish
```

-   A post has exactly one category.
-   A post can have multiple tags.
-   Slugs must be unique.
-   Post cover images are designed for Cloudinary-style storage using:

``` text
url + public_id
```

-   User deletion behavior:
    -   Owned posts should be deleted according to database cascade
        rules.

## Database Design Decisions

-   PostgreSQL is the primary database.
-   Drizzle ORM is used as the database layer.
-   Database design prioritizes:
    -   Foreign keys
    -   Data integrity
    -   Proper constraints
    -   Query performance
    -   Normalized relationships

## Development Philosophy

-   Build Inkly incrementally.
-   Prefer production-oriented architecture over quick CRUD
    implementation.
-   Keep modules separated using:

``` text
controller → service → repository
```

-   Validate input with Zod.
-   Use centralized error handling.
-   Use structured logging.
-   Avoid insecure shortcuts.

## Current Development Point

The project has completed the foundation stage:

✅ Project setup\
✅ TypeScript configuration\
✅ Environment validation\
✅ PostgreSQL connection\
✅ Drizzle setup\
✅ Redis infrastructure\
✅ Authentication foundation\
✅ Categories module

Next major implementation step:

``` text
Posts Module End-to-End
```

The Posts module should include:

-   Database schema completion
-   Repository layer
-   Service layer
-   Controller layer
-   Routes
-   Validation schemas
-   Authorization rules
-   Draft/publish workflow
-   Slug generation
-   Category relation
-   Tag relation preparation
-   Cover image preparation
