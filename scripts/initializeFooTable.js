
function initializeFooTable() {
  $("#tsvTable").footable({
    sorting: {
      enabled: true,
    },
    filtering: {
      enabled: true,
      focus: true,
      container: "#filter-form-container",
    },
    toggle: true,
    paging: {
      container: "#paging-ui-container",
    },
  });
  $("#tsvTable").on("footable_toggle", function (e) {
    // Get the current toggle element that was clicked
    var $currentToggle = $(e.target).closest("tr");

    // Check if the current toggle is active
    if ($currentToggle.attr("data-expanded") === "true") {
      // Untoggle all other rows except the current one
      $("#tsvTable")
        .find('tr[data-expanded="true"]')
        .not($currentToggle)
        .each(function () {
          $(this).removeAttr("data-expanded");
        });
    } else {
      // Set the current toggle to expanded
      $currentToggle.attr("data-expanded", "true");
    }
  });
}

export { initializeFooTable };
