// extend cy commands with same commands as from react-testing-library: getByTest, queryByText, getByLabel etc.
import "cypress-testing-library/add-commands";
import feed from "../fixtures/feed.json";

describe("Notifications application", function() {
  it("showns a message if a user has no new notifications", function() {
    cy.server();
    cy.route({
      method: "GET",
      url: "/feed",
      response: []
    });

    cy.visit("http://localhost:3000");

    // example of using commands like in react-testing-library
    cy.getByText("You have no new notification(s)").should("exist");
  });

  it("shows 3 notifications", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "/feed",
      response: feed
    }).as("getFeed");

    cy.visit("http://localhost:3000");

    cy.wait("@getFeed").then(() => {
      // another example of using commands like in react-testing-library
      cy.queryAllByTestId(/notification-id/).should("have.length", 3);

      // example of taking image snapshot with cypress-image-snapshot (binds jest-image-snapshots to Cypress commands)
      // try changing the Notifications component to break the snapshot and see the generated image diff
      cy.get("[data-testid='notification-id-1']").matchImageSnapshot(
        "first_notification"
      );
    });
  });

  it("changes notifications title when it is liked", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "/feed",
      response: feed
    }).as("getFeed");

    cy.visit("http://localhost:3000");

    cy.wait("@getFeed").then(() => {
      cy.getByTestId("notification-id-1").should("not.contain", "[Liked]");

      cy.getByTestId("notification-id-1")
        .getByText("Like")
        .click();

      cy.getByTestId("notification-id-1").should("contain", "[Liked]");
    });
  });
});
