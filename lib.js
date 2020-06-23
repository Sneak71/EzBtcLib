
var xhr = new XMLHttpRequest();
var api = "https://blockchain.info";

// Address info
class Address {
    // Address is match
    static Match(btc) {
        return btc.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/) != null;
    }
    // Address exists
    static Exists(btc) {
        var url = api + "/balance?cors=true&active=" + btc;
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.status == 200 && !xhr.responseText.includes("Invalid address");
    }
}

// Transaction hash info
class Transaction {
    // Constructor
    constructor(hash) {
        this.hash = hash;
        this.transaction = Transaction.GetTransaction(hash);
    }
    // Return true if transaction exists
    Exists() {
        return this.transaction != null;
    }
    // Get confirmations count
    Confirmations() {
        var block_height = this.transaction;
        if (!("block_height" in block_height)) {
            return 0;
        } else {
            block_height = block_height["block_height"];
        }
        var block_count = Transaction.BlocksCount();
        return block_count - block_height + 1
    }
    // Get total sent btc value
    TotalSent(to) {
        var sent = 0;
        this.transaction["out"].forEach(target => {
            if (target["addr"] == to) {
                sent += target["value"];
            }
        });
        return sent;
    }
    // Get transaction date
    SentDate() {
        var unix = this.transaction["time"];
        return new Date(unix * 1000);;
    }
    // Get blocks count
    static BlocksCount() {
        var url = "https://blockchain.info/q/getblockcount";
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200) {
            return parseInt(xhr.responseText);
        }
    }
    // Convert BTC to USD
    static Convert(btc) {
        var url = "https://blockchain.info/tobtc?currency=USD&value=" + btc;
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200) {
            return parseFloat(xhr.responseText);
        }
    }
    // Get transaction
    static GetTransaction(hash) {
        var url = api + "/rawtx/" + hash + "?cors=true";
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200 && !xhr.responseText
            .includes("Transaction not found")) {
            return JSON.parse(xhr.responseText);
        } else {
            return null;
        }
    }
}