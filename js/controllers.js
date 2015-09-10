var app = angular.module("addressGeneratorApp", ["addressGeneratorApp.services", "ngLodash", "LocalStorageModule"]);
app.controller("addressGeneratorController", function($scope, generatorServices, lodash){
	var backUps = [];
	var passwords = [];
	var totalBalance = 0;
	var mainAddressObjects = [];
	var changeAddressObjects = [];

	var m = $('#selectM').find('option:selected').attr('id');
	var n = $('#selectN').find('option:selected').attr('id');
	
	$scope.backUp1 = '{"iv":"DinhZB41X+YrXiSklh/3rA==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"MrPlnoQu0r4=","ct":"gXkxd9oMiMQWr21DbklkNGx5ciWAzcFGrCNSWleZXB/zPgaZ9Z8yAyLq2of5HFl6HjK2KSGPKEWDyBUHr1sdBrGSx9pyKbgzl8uHBzVuRsRtHk7kyrxARQmShEP0TEM9ngC251yywr3Yn3ZXUP6QB+VfyckK5yOSniP/x0/Ma1dG4xcuqYI0bICONPu/xPwZsPYskyeIclBeVSvFpQEQoyDuJQMd0Kn7sdLgVIMd+QnqCNNfFn8h4X9Al3Y/ov8YO2OqLs9b8Y6FGw9+a8IvDeUbNL13BoN0QhMVf7RfH6KN4ba7mq65ihQHZJ7rmm5p00XsUJfWWEAIfCFqCBmu/x4ItbtDOIUi7sm4KfGiWFbH78M/7IEhVK9p/FBoqVgTPzt7c6h6HW9SauI3H6LdVJZKPUZ08PLk7XCI1x36vYiLyJH+35xRBhYNm44LVPcJG3UvbBEozcxNIEdf0T3pLy71iag78Sh5T7JYhS/2rHYYtgLfCptwgGc78GD361ksgkkFqrXUS0Wm0QPkKhKdGnZY8ZTZ2HNRNad+1pI7Rmop534ZkVOl1j/tOXeKkcz2zbGmyEGxk92WI+t9v0Ste0wf+ab7lNA8uRaiOttEPe2Dttx53dBnlnRYiPBkjDn0wKsQKbg691n2hwvySUURqLnfWmrsvaa8JEQ4Wk/llDtt7XyW36TSQTdUhH9VIjqTOYcQKsTc1+1qSXfkahX6GBpBlS7q9rF7raLrOiT7ous+rBEgkpLoNxPhzAlx25RKlI++cRQ4A3cDQedPdN70qtmZ8V5sCTwl0otIK9Z2GKHZ0+wg4QLvP53ut5UWGlZ+olWTKQAeLmpqLGjLVa1lMke1Ik1CKpizYocDhu+Twd0zcWCBhND3ZEo8ZzeAqUj4XbXkWxvVGuogvMyVtcmbVvx6R1Esz7WpJ2pGtTyarNK+ahcopugNM7nRmT72us2+x5l5gpqZVUm0VgGkUsJc8voR8wRra66xD0RSxxGsaYxtiUiPPYtp7WDGIdxTV84wLWR+gzU+XDs+fZqwWuMjEAFU40uf2c0a/4FODKsulC8XaXxwRObWhgFXn5JsKAN8Bsdx8NA0HXJO1GfASZgKHh0WfghxXlnj3moL5DBO6xZ00U8Z6yZp1PN76K9uVxpEXNb3jJyrJq4CoODWiyM70Xw/IgPr7VebZLQohPS5O7M+EpI4zB1ainoviFr5M/P9ClI9DA7iR1LrGEKOOY7BSLp+4RQwCCJvO5EWw6O4CZWURB/7NYVGYMidEZ7BUpGfKa8ikpHadaAH2ljLlcJ0w2bIAjGU2GwzyADw0hOkyoyUpQ0/xN5p1Up1v7IOSnTYXcAj1NvVlx/3OGkxSigqME/uGiYORH1CPzCl1/RztywAYW4y/D8dWfmMdxgzQDw7V0Zio0/sUQ+u1C3AangO4lON9a+8qW9L61WMZIrueR1wV3QiUtGTa/uPxREdhzNTLxDbgidE/8FzIwsV97DcFDO1wEhYAO4zKsH9tOy3Wd0NDK+pL3edwagO8wlBvMW+kMLtpDMavoUs71xs3OHSQNhbUSL0PYTLnwlbjpob3X5WQEGDqeRQmbWTLT19HHbRKSImu6C7LPdakgTN+F6PAVnL6qjOJQRq4+uIzM8sxYBhaT26BfqyyZpX1Wc+Dm+K7KW0b7k6ProygFPHkyIGso9FXKdPwh9bZrr9LSB0O7tf+zgufJBOJDYhnkutQeS/7EbRtMUHyIb0BQ731aDMZEn1pz8BxXhDj2Y+7Svpf6g8lVf+RNuGzootKG5wtsF+Ifi3yMXvBYexBb2419pENCEJHfdc7qclYY/p2I3D"}';
	$scope.password1 = '1';
	$scope.backUp2 = '{"iv":"mFYqMGceR0Vx5zEmjrJbvg==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"r8oXs6zFfhk=","ct":"vOc12h879oLO6Vy7O/wOIy7mmm6MD9la2AU1cuhYQqFjDdCJ57Uxpxf1k1akBNIwxSTEV03k4A+0kttyN63CTJs1CkG26i+/1iBiGDw9iKgPVbMn8QmCaklB0LMWtkriDkV3XB+BV116I3aniOi+hfTg9l9r0mId2y9mpz6ZfH1YRsVCXM9raCQIDe5SYU7lL7yln2jOtl1+s13t/vVWAJfWr4C9oice9HWxAVQXnTbBH8MWptxuQUy5rnt+6vmYvibMKO57hjOZoavqE/fzWJWvOz4TqNM1Z7LXMPmrbpXGrz9PsgwRvIC/T1XbPGtHHicq+7cgfh4Dko+bCk4ILBtcGdNRUdu9tLw4+zeAp+7nHpVXzdWvy4Ep9i80EliXKruHY7y3QOx8D0e2LGsGefqVYpwWsL3SokDxWE9df0RVxS/VCvlfpl67L7kBJOY/yB6H8qHIKLjVEUUR7wvxyBO0W6TE4RFWoZQf0wScUX/2ophNhz/UVmFyiBwgHRDqrcLr1rDwrby4XZdI/lowfnDrvrwscs+Iyd4fw6bfAgdVjaP+sdIaU7UD8tde4iC04+GwqQJx4fIvQHss97HcqQRBh/rBZgr1WVF0J+x8YFUNMdxeaBXQ4gy5FipKR5N4pJHt9dDZhOash0Vhb+cDhrsamW1u0NovZlU4ok1x/G6S5fEoWSOh+On5w1Ar0474ucNuoO8Zzk5xwNmPvJ2zSxv9KJCHp/mvavirLqmmS4ilbLbqK3Mbq6RUXAf6RCd6equv7k2rZaV8WcWc5vCDS/XlOB0E9PbetOVTwfgz54MtKt37nMW+sb9zdPIJnWyfRfQJTpmqJ80KGtZHXKQ7a7Z8vuXYMbb3VyQpbv9pgSjWd0+bECKceoYVPBr6kaYmPLkEKjL6tCwVdNd/mlf0wNNuV0V6uyx29YJz3IMDpU1/gK18JlsCSWyCcAdH0nwxAlkJqZAXjBWXH7kiRVamPgn4rpvWBij/vtRUP0dFag/i6L7yaBo3WO/hfG5wXwuY8cnTt2XU87Stc0KwMVBaIFqyn8P4tNlg6XigtEFYA/4j1yvK7IYOwvNpNuJsrwaAh/lHuvmC6lw8V29VkiHZ26XUj7B7fJrfSAFIsuJmp7k9Dc+Lsxi4RQShJ9h5kwz4TyG4ZwT2QLD50mnEDoN+I/BzceLD3zP8cPSHl/CxFRvDbfxJT1SmONIt1jxfBRnQ8O2ivk9K/mWwtKyFztXbv7Ki4/fkNlb3akVgrLB7f3jppNXlPbQk0n8wG9QQi1l4GS3ZEAw3UIEufNWGHPc4Lyumkf1C/Ut9YJXB/Q5mTDi5d/9lLph+QdkPl7Asi3q3nflqSOZTlSepiIlCXq3w0vFqI9m3LF9LYcmzPt2egF/pzn6IMIxqY6iVvTVr/owvFejy4tosvBs9iXMY/9Tkcoo2Mwa+npu9IXF3lzdgSuzBYJ0zXNXjci7z9tIT8pAm9pcGS9DFlX/kfALrWmJeIQlq9mnDvx5w1yCPl2CQ2pwJSEEvXaQ7gH8q7c3a/PQ/BxBpnkufYjFa+FMtTW7VV5Kg2lryJbEi60k9SO2iJqUAdV0hNk6I9XpcxevBEV7fBpKT65Jx/xv1mbpAcylKFEVTWnOoSIqX4Acv6TEjLBFRE5WV6yqprQ+O7YOlGMZ3ErD01BvZRtt92TXZEGGYWaDOZ8Pfr6VfGHVSVl85P3+qscHUPb31e2RhDsQ3zTx1bYm6WmjpUmmVnzKShMYLLPLg9bLQMGklPeFTCPXmtladR3P23iHeSNRfhipD8VgUIkC8gtAm5XpOPIjC4wNo7QJuD0ZfKokCyQcQRpg="}';
	$scope.password2 = '1';
	$scope.textArea = "";
	$scope.addr = "2N1pw2p7ZcvfQnjvYMUfrvHVN7hFoz4Rba3";

	$('#form3, #form4, #form5, #form6').hide();

	$('#selectM').change(function() {
   		$('#form1, #form2, #form3, #form4, #form5, #form6').hide();
   		for (var i = 1; i <= $(this).find('option:selected').attr('id'); i++)
   			$('#form' + i).show();
	});

	$('#selectN').change(function(){
		n = $(this).find('option:selected').attr('id');
	});

	$scope.getDataInput = function(){
		backUps.push($scope.backUp1,$scope.backUp2,$scope.backUp3,$scope.backUp4,$scope.backUp5,$scope.backUp6);
		passwords.push($scope.password1,$scope.password2,$scope.password3,$scope.password4,$scope.password5,$scope.password6);
		
		backUps = lodash.remove(backUps,function (r){
			return !lodash.isUndefined(r);
		});

		passwords = lodash.remove(passwords,function (r){
			return !lodash.isUndefined(r);
		});
		
		var dataInput = [];
		var data = {};

		for(var i=0; i<backUps.length ;i++){
			data = {
				backup: backUps[i],
				password :passwords[i]
			};
			dataInput.push(data);
		}
		
		var validation = generatorServices.validateInput(backUps, passwords, m, n);
		var backupData = [];

		if(validation == true){
			lodash.each(dataInput, function(d){
				backupData.push(generatorServices.getBackupData(d.backup, d.password));
			});

			$scope.textArea = 'Searching main addresses...\n\n';
			$scope.generate(lodash.pluck(backupData, 'xPrivKey'));

		}else{
			$("#button2").hide();
			$scope.textArea = validation;
		}
	}

	$scope.generate = function(xPrivKeys){
		var mainPath = "m/45'/2147483647/0/";
		var changePath = "m/45'/2147483647/1/";

		// getting main addresses
		generatorServices.getAddressStatus(xPrivKeys, mainPath, n, function(mainAddressArray){
			if(mainAddressArray.length > 0){
				$scope.printFeedBack(mainAddressArray);
				mainAddressObjects = mainAddressArray;
				// console.log(mainAddressObjects)
			}
			else
				$scope.textArea += 'No main addresses available.\n\n';

			$scope.textArea += 'Searching change addresses...\n\n';

			// getting change addresses
			generatorServices.getAddressStatus(xPrivKeys, changePath, n, function(changeAddressArray){
				if(changeAddressArray.length > 0){
					$scope.printFeedBack(changeAddressArray);
					changeAddressObjects = changeAddressArray;
					// console.log(changeAddressObjects)
				}
				else
					$scope.textArea += 'No change addresses available.\n\n';

				$("#button2").show();
				$scope.textArea += 'Search complete.\n\n';
			});
		});
	}

	$scope.printFeedBack = function(addressObject){
		$scope.textArea += 'Addresses found: ' + addressObject.length + '\n*************************\n';
				
		lodash.each(addressObject, function(ao){
			// console.log(ao);
			$scope.textArea += 'Address: ' + ao.address + '\n';
			$scope.textArea += 'Balance: ' + ao.balance + '\n\n';

			totalBalance += ao.balance;
		});
	}

	$scope.send = function(){
		var addr = $scope.addr;
		var validation = generatorServices.validateAddress(addr, totalBalance);

		if(validation == true){
			$scope.textArea += 'Creating transaction to retrieve total amount...\n\n';

			var rawTx = generatorServices.createRawTx(addr, totalBalance, mainAddressObjects.concat(changeAddressObjects), m);
			generatorServices.txBroadcast(rawTx).then(function(response){
				$scope.message = "Transaction complete.";
			});
		}else
			$scope.textArea += validation + '\n\n';		
	}
});


