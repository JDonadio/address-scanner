var app = angular.module("addressScannApp", ["addressScannApp.services", "ngLodash"]);
app.controller("addressScannController", function($scope, scannServices, lodash){
	var network = '';
	var fee = 0.0001;
	var totalBtc = 0;
	var mainAddressObjects = [];
	var changeAddressObjects = [];

	var m = $('#selectM').find('option:selected').attr('id');
	var n = $('#selectN').find('option:selected').attr('id');

	$('#form2, #form3, #form4, #form5, #form6').hide();

	$('#selectM').change(function(){
		m = $(this).find('option:selected').attr('id');
	});

	$('#selectN').change(function() {
		n = $('#selectN').find('option:selected').attr('id');
   		$('#form1, #form2, #form3, #form4, #form5, #form6').hide();

   		for (var i = 1; i<=n ; i++)
   			$('#form' + i).show();
	});

	$scope.getDataInput = function(){
		$scope.hideMessage();
		$("#button2").hide();
		totalBtc = 0;
		var backUps = [];
		var passwords = [];
		
		backUps.push($scope.backUp1,$scope.backUp2,$scope.backUp3,$scope.backUp4,$scope.backUp5,$scope.backUp6);
		passwords.push($scope.password1,$scope.password2,$scope.password3,$scope.password4,$scope.password5,$scope.password6);
		
		backUps = lodash.remove(backUps,function (r){
			return !lodash.isUndefined(r);
		});

		passwords = lodash.remove(passwords,function (r){
			return !lodash.isUndefined(r);
		});



		if(backUps.length > 0 && passwords.length > 0){
			var dataInput = [];
			var data = {};

			for(var i=0; i<backUps.length ;i++){
				data = {
					backup: backUps[i].toString(),
					password :passwords[i]
				};
				dataInput.push(data);
			}

			console.log("Validation in progress...");
			var validation = scannServices.validateInput(dataInput, m, n);

			if(validation == true){
				var backupData = [];

				lodash.each(dataInput, function(d){
					backupData.push(scannServices.getBackupData(d.backup, d.password));
				});

				network = lodash.uniq(lodash.pluck(backupData, 'network')).toString();
				console.log('Network: ', network.toString());
				$scope.generate(backupData);

			}else{
				$("#button2").hide();
				$scope.showMessage(validation, 3);
			}
		}else{
			$("#button2").hide();
			$scope.showMessage('Please enter values for all entry boxes.', 3);
		}
	}

	$scope.generate = function(backupData){
		var mainPath = "m/45'/2147483647/0/";
		var changePath = "m/45'/2147483647/1/";

		$scope.showMessage('Searching main addresses...', 1);
		$scope.textArea = 'Main addresses:\n\n';
		console.log("Getting addresses...");

		// getting main addresses
		scannServices.getActiveAddresses(backupData, mainPath, n, function(mainAddressArray){
			if(mainAddressArray.length > 0){
				$scope.printFeedBack(mainAddressArray);
				mainAddressObjects = mainAddressArray;
				console.log("## Active main addresses:");
				console.log(mainAddressObjects);
			}
			else{
				$scope.textArea += 'No main addresses available.\n\n';
				console.log("No main addresses available.");
			}

			$scope.showMessage('Searching change addresses...', 1);
			$scope.textArea += 'Change addresses:\n\n';

			// getting change addresses
			scannServices.getActiveAddresses(backupData, changePath, n, function(changeAddressArray){
				if(changeAddressArray.length > 0){
					$scope.printFeedBack(changeAddressArray);
					changeAddressObjects = changeAddressArray;
					console.log("## Active change addresses:");
					console.log(changeAddressObjects);
				}
				else{
					$scope.textArea += 'No change addresses available.\n\n';
					console.log("No change addresses available.");
				}

				$("#button2").show();

				if((totalBtc - fee) > 0)
					$scope.showMessage('Total amount to be recovered: ' + (totalBtc - fee).toFixed(8) + '  BTC.', 1);
				else
					$scope.showMessage('Total amount to be recovered: 0 BTC.', 1);

				console.log("Search complete.");
			});
		});
	}

	$scope.printFeedBack = function(addressObject){
		var totalFound = 0;
				
		lodash.each(addressObject, function(ao){
			if(ao.utxo.length > 0){

				$scope.textArea += 'Address: ' + ao.address + '\n';
				$scope.textArea += 'Path: ' + ao.path + '\n';
				$scope.textArea += 'Balance: ' + ao.balance + '\n';
				$scope.textArea += 'Unconfirmed balance: ' + ao.unconfirmedBalance + '\n\n';
				lodash.each(ao.utxo, function(u){
					totalBtc += u.amount;
				})
				console.log('@@@@@@ Addresses with unspent amount:', ao);
				totalFound++;
			}
			console.log(totalBtc)
		});
		$scope.textArea += 'Addresses with unspent amount: ' + totalFound + '\n********************************************\n';
	}

	$scope.hideMessage = function(){
		$('#errorMessage').hide();
		$('#successMessage').hide();
		$('#statusMessage').hide();
	}

	$scope.showMessage = function(message, type){
		/*
			1 = status
			2 = success
			3 = error
		*/

		if(type == 1){
			$scope.statusMessage = message;
			$('#statusMessage').show();
			$('#errorMessage').hide();
			$('#successMessage').hide();
		}
		else if(type == 2){
			$scope.successMessage = message;
			$('#successMessage').show();
			$('#errorMessage').hide();
			$('#statusMessage').hide();
		}
		else{
			$scope.errorMessage = message;
			$('#errorMessage').show();
			$('#successMessage').hide();
			$('#statusMessage').hide();
		}
	}

	$scope.send = function(){
		var addr = $scope.addr;
		var validation = scannServices.validateAddress(addr, totalBtc, network.toString());

		if(validation == true){
			$scope.showMessage('Creating transaction to retrieve total amount...', 1);

			var rawTx = scannServices.createRawTx(addr, network.toString(), mainAddressObjects.concat(changeAddressObjects), m);
			
			scannServices.txBroadcast(rawTx, network. toString()).then(function(response, error){
				if(error){

				}else{
					$scope.showMessage((totalBtc - fee).toFixed(8) + ' BTC sent to address: ' + addr, 2);
					console.log('Transaction complete.  ' + (totalBtc - fee).toFixed(8) + ' BTC sent to address: ' + addr);
				}
			});
		}else
			$scope.showMessage(validation, 3);
	}
});


