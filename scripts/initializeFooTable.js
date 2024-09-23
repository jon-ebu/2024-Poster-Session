
function initializeFooTable() {
  $("#tsvTable").footable({
    sorting: {
      enabled: true,
    },
    filtering: {
      enabled: true,
      focus: false,
      container: "#filter-form-container",
    },
    toggle: true,
    paging: {
      enabled: false,
      limit: 1000,
      container: "#paging-ui-container",
    },
    'on': {
      'postinit.ft.table': function (e, ft) {
        /*
         * e: The jQuery.Event object for the event.
         * ft: The instance of the plugin raising the event.
         */
        // Sort the table by the "easel board" column on load
        const easelBoardColumnIndex = 6; 
        ft.sort(easelBoardColumnIndex, 'asc');
      }
    }
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
  })
}
export { initializeFooTable };
