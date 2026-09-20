// Runs once before the test suite. Sets predictable environment variables
// so tests don't depend on a developer's real .env file.
process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.USE_MOCK_DB = "true"; // default; individual test files override per-test as needed
