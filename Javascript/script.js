/*
File: script.js
GUI Assignment: HW4
Charlie Auwerda
charles_auwerda@student.uml.edu
updated by CA on December 04, 2023
*/

$(document).ready(function() {
    // Initialize sliders and two-way binding
    function initializeSliders() {
        ['multiplierStart', 'multiplierEnd', 'multiplicandStart', 'multiplicandEnd'].forEach(function(id) {
            var input = $('#' + id);
            var slider = $('#' + id + 'Slider');
            slider.slider({
                min: -50,
                max: 50,
                slide: function(event, ui) {
                    input.val(ui.value);
                }
            });
            input.on('input', function() {
                slider.slider('value', this.value);
            });
        });
    }

    initializeSliders();

    // Function to update the multiplication table
    function triggerTableUpdate() {
        var multiplierStart = parseInt($('#multiplierStart').val(), 10);
        var multiplierEnd = parseInt($('#multiplierEnd').val(), 10);
        var multiplicandStart = parseInt($('#multiplicandStart').val(), 10);
        var multiplicandEnd = parseInt($('#multiplicandEnd').val(), 10);
        generateTable(multiplierStart, multiplierEnd, multiplicandStart, multiplicandEnd);
    }

    // jQuery Validation for the form
    $('#tableForm').validate({
		submitHandler: function(form, event) {
			event.preventDefault(); // Prevent default form submission
			triggerTableUpdate();
		},
    });

    // Tab Initialization
    $("#tabs").tabs();

    // Function to generate multiplication table
    function generateTable(mStart, mEnd, pStart, pEnd) {
		const tableContainer = document.getElementById('tableOutput');
		if (!tableContainer) {
			console.error('Table container not found.');
			return;
		}

		tableContainer.innerHTML = '';

		if ((Math.abs(mEnd - mStart) + 1) * (Math.abs(pEnd - pStart) + 1) > 10000) {
			const errorContainer = document.getElementById('error-message');
			errorContainer.textContent = 'The requested table is too large and may cause performance issues.';
			return;
		}

		const table = document.createElement('table');
		const thead = table.createTHead();
		const tbody = table.createTBody();

		const headerRow = thead.insertRow();
		headerRow.appendChild(document.createElement('th'));

		for (let i = mStart; mStart <= mEnd ? i <= mEnd : i >= mEnd; mStart <= mEnd ? i++ : i--) {
			let th = document.createElement('th');
			th.textContent = i;
			headerRow.appendChild(th);
		}

		for (let i = pStart; pStart <= pEnd ? i <= pEnd : i >= pEnd; pStart <= pEnd ? i++ : i--) {
			let row = tbody.insertRow();
			let headerCell = document.createElement('th');
			headerCell.textContent = i;
			row.appendChild(headerCell);

			for (let j = mStart; mStart <= mEnd ? j <= mEnd : j >= mEnd; mStart <= mEnd ? j++ : j--) {
				let cell = row.insertCell();
				cell.textContent = i * j;
			}
		}

		tableContainer.appendChild(table);
		table.setAttribute('id', 'multTable');

		var tabTitle = mStart + ", " + mEnd + ", " + pStart + ", " + pEnd;
		var tabContent = $("<div>").append(table);
		addNewTab(tabTitle, tabContent);
	}

    // Function to add a new tab
	function addNewTab(title, content) {
		var tabCounter = $("#tabs ul li").length + 1;
		var label = title || "Tab " + tabCounter;
		var id = "tabs-" + tabCounter;

		// Adding a span element for the close icon
		var li = $('<li><a href="#' + id + '">' + label + '</a> <span class="ui-icon-close">x</span></li>');
		
		var tabContentHtml = $('<div id="' + id + '">').append(content);

		// Append the new tab and content
		$("#tabs ul").append(li);
		$("#tabs").append(tabContentHtml);
		$("#tabs").tabs("refresh");
	}

	// Close icon: removing the tab on click
	$("#tabs").on("click", "span.ui-icon-close", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		$("#tabs").tabs("refresh");
	});

});