import { SpecReporter } from "jasmine-spec-reporter";

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayDuration: true,
      displayErrorMessages: true,
      displayFailed: true,
      displayPending: true,
      displaySuccessful: true,
    },
  })
);
