var app = angular.module("addressGeneratorApp.services",['ngLodash']);
app.service('generatorServices',['$http', 'lodash',function($http, lodash){
	var bitcore = require('bitcore');
	var Transaction = bitcore.Transaction;
	var Address = bitcore.Address;
	var GAP = 10;
	var root = {};

	root.validateInput = function(dataInput, m, n){
		lodash.each(dataInput, function(di){
			if (di.backup == "" || di.password == "")
				return "Please enter values for all entry boxes.";

			try {
				jQuery.parseJSON(di.backup);
			} catch(e) {
				return "Your JSON is not valid, please copy only the text within (and including) the { } brackets around it.";
			};

			try {
				sjcl.decrypt(di.password, di.backup);
			} catch() {
				return "Seems like your password is incorrect. Try again.";
			};

			if (JSON.parse(sjcl.decrypt(di.password, di.backup)).m != m || JSON.parse(sjcl.decrypt(di.password, di.backup)).n != n)
				return "The wallet (" + i + ") type (m/n) is not matched with 'm' and 'n' values.";

		});
		return true;
	}

	root.getBackupData = function(backup, password){
		var jBackup = JSON.parse(sjcl.decrypt(password, backup).toString());
		
		return {
			xPrivKey: jBackup.xPrivKey,
			m: jBackup.m,
			n: jBackup.n
		};
	}

	root.getAddressStatus = function(xPrivKeys, path, n, callback){
		var inactiveCount = 0;
		var count = 0;
		var activeAddress = [];

		function derive(index){
			root.generateAddress(xPrivKeys, path, index, n, function(address){	
				root.getAddressData(address, function(addressData){

					if (!jQuery.isEmptyObject(addressData)) {
						activeAddress.push(addressData);
						inactiveCount = 0;
						// console.log(activeAddress);
					}
					else 
						inactiveCount++;

					if (inactiveCount > GAP)
						return callback(activeAddress);
					else 
						derive(index + 1);
				});
			});
	    };
		derive(0);
	}

	root.generateAddress = function(xPrivKeys, path, index, n, callback){
		var derivedPublicKeys = [];
		var derivedPrivateKeys = [];
		var address = {};

		lodash.each(xPrivKeys, function(xpk){
			var hdPrivateKey = bitcore.HDPrivateKey(xpk);

			// private key derivation
			var derivedHdPrivateKey = hdPrivateKey.derive(path + index);
			var derivedPrivateKey = derivedHdPrivateKey.privateKey;
			derivedPrivateKeys.push(derivedPrivateKey);

			// public key derivation
			var derivedHdPublicKey = derivedHdPrivateKey.hdPublicKey;
			var derivedPublicKey = derivedHdPublicKey.publicKey;

			derivedPublicKeys.push(derivedPublicKey);
		});

		address = {
			name: new bitcore.Address(derivedPublicKeys, parseInt(n)),
			pubKeys: derivedPublicKeys,
			privKeys: derivedPrivateKeys
		};

		return callback(address);
	}

	root.getAddressData = function(address, callback){
		// call insight API to get address information
		root.checkAddress(address.name).then(function(respAddress){

			// call insight API to get utxo information
			root.checkUtxos(address.name).then(function(respUtxo){

				var addressData = {};

				if(respAddress.data.unconfirmedTxApperances + respAddress.data.txApperances > 0){				
					addressData = {
						address: respAddress.data.addrStr, 
						balance: respAddress.data.balance,
						utxo: respUtxo.data,
						privKeys: address.privKeys,
						pubKeys: address.pubKeys
					};
					// console.log(addressData)
				}
				return callback(addressData);
			});
		});
	}

	root.checkAddress = function(address){
		return $http.get('https://test-insight.bitpay.com/api/addr/' + address + '?noTxList=1');
	}

	root.checkUtxos = function(address){
	    return $http.get('https://test-insight.bitpay.com/api/addr/' + address + '/utxo?noCache=1');
    }

	root.createRawTx = function(address, totalBalance, addressObjects, m){
		var tx = new Transaction();
		var amount = parseInt((totalBalance * 100000000 - 10000).toFixed(0));
		var privKeys = [];

		lodash.each(addressObjects, function(ao){
			if(ao.utxo.length > 0){
				lodash.each(ao.utxo, function(u){
					tx.from(u, ao.pubKeys, m * 1);
					privKeys = privKeys.concat(ao.privKeys);
				});
			}
		});

		tx.to(address, amount);
		tx.sign(lodash.uniq(privKeys));

		var rawTx = tx.serialize();
		return rawTx;
	}

	root.validateAddress = function(addr, totalBalance){
		if(addr == '' || addr.length < 20 || !Address.isValid(addr))
			return 'Please enter a valid address.';
		if(totalBalance <= 0)
			return 'The total balance in your address is 0';
		return true;
	}

	root.txBroadcast = function(rawTx){
		return $http.post('https://test-insight.bitpay.com/api/tx/send', {rawtx: rawTx});
	}

	return root;
}]);







