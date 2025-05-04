export function getEnvFile() {
  return `env/${process.env.NODE_ENV || 'development'}.env`;
}
