export function registrationConsentRecords(userId: string) {
  return [
    { userId, purpose: "TERMS_ACCEPTANCE", status: "GRANTED", source: "REGISTRATION" },
    { userId, purpose: "PRIVACY_PROCESSING", status: "GRANTED", source: "REGISTRATION" },
  ];
}
