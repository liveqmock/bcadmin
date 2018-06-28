var available_printers = null;
var selected_category = null;
var default_printer = null;
var selected_printer = null;
var format_start = "^XA^LL200^FO80,50^A0N36,36^FD";
var format_end = "^FS^XZ";
var default_mode = true;
var ticketList = JSON.parse(sessionStorage.getItem('ticketList'))

function setup_web_print()
{
	$('#printer_select').on('change', onPrinterSelected);
	showLoading("Loading Printer Information...");
	default_mode = true;
	selected_printer = null;
	available_printers = null;
	selected_category = null;
	default_printer = null;

	BrowserPrint.getDefaultDevice('printer', function(printer)
	{
		default_printer = printer
		if((printer != null) && (printer.connection != undefined))
		{
			selected_printer = printer;
			var printer_details = $('#printer_details');
			var selected_printer_div = $('#selected_printer');

			selected_printer_div.text("Using Default Printer: " + printer.name);
			hideLoading();
			printer_details.show();
			$('#print_form').show();

		}
		BrowserPrint.getLocalDevices(function(printers)
			{
				available_printers = printers;
				var sel = document.getElementById("printers");
				var printers_available = false;
				sel.innerHTML = "";
				if (printers != undefined)
				{
					for(var i = 0; i < printers.length; i++)
					{
						if (printers[i].connection == 'usb')
						{
							var opt = document.createElement("option");
							opt.innerHTML = printers[i].connection + ": " + printers[i].uid;
							opt.value = printers[i].uid;
							sel.appendChild(opt);
							printers_available = true;
						}
					}
				}

				if(!printers_available)
				{
					showErrorMessage("No Zebra Printers could be found!");
					hideLoading();
					$('#print_form').hide();
					return;
				}
				else if(selected_printer == null)
				{
					default_mode = false;
					changePrinter();
					$('#print_form').show();
					hideLoading();
				}
			}, undefined, 'printer');
	},
	function(error_response)
	{
		showBrowserPrintNotFound();
	});
};
function showBrowserPrintNotFound()
{
	showErrorMessage("An error occured while attempting to connect to your Zebra Printer. You may not have Zebra Browser Print installed, or it may not be running. Install Zebra Browser Print, or start the Zebra Browser Print Service, and try again.");

};
function sendData()
{
	showLoading("Printing...");
	checkPrinterStatus( function (text){
		if (text == "Ready to Print")
		{
      for (var i = 0; i <ticketList.length; i++) {
        let str = ''
        let hour = ''
        if (ticketList[i].type === '单次票') {
          hour = ticketList[i].hours + '小时'
        } else if (ticketList[i].type === '陪同票') {
          hour = '全天有效,限两次进出场'
        } else {
          hour = '全天有效'
        }
        if (ticketList[i].type === '体验课') {
          str = '^XA^FT300,900^BQN,4,8,,0^FDHA,' + ticketList[i].code + '^FS^FX Second section with recipient address and permit information.^CFA,30^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,350^FD票价: ' + '¥' + ticketList[i].price +'^FS^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,388^FD时长: ' + '0.5h' +'^FS^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,486^FD票号: ' + ticketList[i].code + '^FS^CFA,15^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,1050^FD票号: '+ ticketList[i].code +'^FS^CFA,15^XZ'
        } else {
          str = '^XA^FT300,900^BQN,4,8,,0^FDHA,' + ticketList[i].code + '^FS^FX Second section with recipient address and permit information.^CFA,30^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,350^FD票价: ' + '¥' + ticketList[i].price +'^FS^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,388^FD时长: ' + hour +'^FS^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,436^FD使用日期: '+ ticketList[i].useDate +'^FS^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,486^FD票号: ' + ticketList[i].code + '^FS^CFA,15^CI28^A@N,40,40,E:SIMSUN.FNT^FO50,1050^FD票号: '+ ticketList[i].code +'^FS^CFA,15^XZ'
        }
        selected_printer.send(str, printComplete, printerError);
      }
		}
		else
		{
			printerError(text);
		}
	});
};
function checkPrinterStatus(finishedFunction)
{
	selected_printer.sendThenRead("~HQES",
				function(text){
						var that = this;
						var statuses = new Array();
						var ok = false;
						var is_error = text.charAt(70);
						var media = text.charAt(88);
						var head = text.charAt(87);
						var pause = text.charAt(84);
						// check each flag that prevents printing
						if (is_error == '0')
						{
							ok = true;
							statuses.push("Ready to Print");
						}
						if (media == '1')
							statuses.push("Paper out");
						if (media == '2')
							statuses.push("Ribbon Out");
						if (media == '4')
							statuses.push("Media Door Open");
						if (media == '8')
							statuses.push("Cutter Fault");
						if (head == '1')
							statuses.push("Printhead Overheating");
						if (head == '2')
							statuses.push("Motor Overheating");
						if (head == '4')
							statuses.push("Printhead Fault");
						if (head == '8')
							statuses.push("Incorrect Printhead");
						if (pause == '1')
							statuses.push("Printer Paused");
						if ((!ok) && (statuses.Count == 0))
							statuses.push("Error: Unknown Error");
						finishedFunction(statuses.join());
			}, printerError);
};
function hidePrintForm()
{
	$('#print_form').hide();
};
function showPrintForm()
{
	$('#print_form').show();
};
function showLoading(text)
{
	$('#loading_message').text(text);
	$('#printer_data_loading').show();
	hidePrintForm();
	$('#printer_details').hide();
	$('#printer_select').hide();
};
function printComplete()
{
	hideLoading();
	// alert ("Printing complete");
}
function hideLoading()
{
	$('#printer_data_loading').hide();
	if(default_mode == true)
	{
		showPrintForm();
		$('#printer_details').show();
	}
	else
	{
		$('#printer_select').show();
		showPrintForm();
	}
};
function changePrinter()
{
	default_mode = false;
	selected_printer = null;
	$('#printer_details').hide();
	if(available_printers == null)
	{
		showLoading("Finding Printers...");
		$('#print_form').hide();
		setTimeout(changePrinter, 200);
		return;
	}
	$('#printer_select').show();
	onPrinterSelected();

}
function onPrinterSelected()
{
	selected_printer = available_printers[$('#printers')[0].selectedIndex];
}
function showErrorMessage(text)
{
	$('#main').hide();
	$('#error_div').show();
	$('#error_message').html(text);
}
function printerError(text)
{
	showErrorMessage("An error occurred while printing. Please try again." + text);
}
function trySetupAgain()
{
	$('#main').show();
	$('#error_div').hide();
	setup_web_print();
	//hideLoading();
}


