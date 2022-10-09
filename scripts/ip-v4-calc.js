/*
script for calculating ipv4
version: 1.2
author: Huafeng Yu
contact: yuhuafeng@gmailcom
release date: 2022/10/09

input: an ip v4 address, e.g.: 192.168.1.137/24
calculate: subnet mask, network id, first assignable ip, last assignable ip, broadcast ip, assignable ip count
            all in decinal and binary format
*/
class ipV4{
    constructor(ipStr){
        this.ipValid = false
        this.ipData = {}
        /*
        this.ipData = {'ipString':'192.168.23.137/24', 'ipDec':[192,168,23,137], 
            'subnetMaskLen': 24,
            'ipBinary':['11000000', '10101000', '00010111', '10001001'],
            'subetMaskDec':[255, 255, 255, 0],
            'subnetMaskBin':['11111111', '11111111', '11111111', '00000000'],
            'networkIdDec': [192, 168, 23, 0],
            'networkIdBin': ['11000000', '10101000', '00010111', '00000000'],
            'firstIPdec':[192, 168, 23, 1],
            'firstIpBin':['11000000', '10101000', '00010111', '00000001'],
            'lastIpDec':[192, 168, 23, 254],
            'lastIpBin':['11000000', '10101000', '00010111', '11111110']}
        */
        this.ipData['ipStrng'] = ipStr
        if(this.splitIP(ipStr)){
            this.getNetMask()
            this.getNetworkId()
            this.getFirstAssignableIp()
            this.getLastAssignableIp()
            this.getBroadcastIp()
            this.getHostCount()
        }
    }
    get ipDec(){
        return this.ipData['ipDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get ipBin(){
        return this.ipData['ipBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get subnetMaskDec(){
        //return this.ipData['subnetMaskDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
        return this.ipData['subnetMaskDec'].join('.')
    }
    get subnetMaskBin(){
        //return this.ipData['subnetMaskBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
        return this.ipData['subnetMaskBin'].join('.')
    }
    get networkIdDec(){
        return this.ipData['networkIdDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get networkIdBin(){
        return this.ipData['networkIdBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get firstAssignableIpDec(){
        return this.ipData['firstIpDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get firstAssignableIpBin(){
        return this.ipData['firstIpBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get lastAssignableIpDec(){
        return this.ipData['lastIpDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get lastAssignableIpBin(){
        return this.ipData['lastIpBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get broadcastIpDec(){
        return this.ipData['broadcastIpDec'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get broadcastIpBin(){
        return this.ipData['broadcastIpBin'].join('.').concat('/', this.ipData['subnetMaskLen'])
    }
    get hostCount(){
        return this.ipData['hostCount']
    }

    getNetMask(){
        const len = this.ipData['subnetMaskLen']
        const netMask = '1'.repeat(len) + '0'.repeat(32-len)
        this.ipData['subnetMaskBin'] = []
        this.ipData['subnetMaskBin'].push( netMask.slice(0,8) )
        this.ipData['subnetMaskBin'].push( netMask.slice(8,16) )
        this.ipData['subnetMaskBin'].push( netMask.slice(16,24) )
        this.ipData['subnetMaskBin'].push( netMask.slice(24,32) )
        //this.ipData['subnetMaskDec'].splice(0, this.ipData['subnetMaskDec'].length, ...this.convertBinIpToDec(this.ipData['subnetMaskBin']) )
        this.ipData['subnetMaskDec'] = this.convertBinIpToDec(this.ipData['subnetMaskBin'])
        //console.log(this.ipData['subnetMaskDec'])
    }
    getNetworkId(){
        this.ipData['networkIdDec'] = []
        for( let idx = 0; idx < 4; idx++ ){
            this.ipData['networkIdDec'].push(this.ipData['ipDec'][idx] & this.ipData['subnetMaskDec'][idx])
        }
        this.ipData['networkIdBin'] = this.convertDecIpToBin( this.ipData['networkIdDec'] )
    }
    getFirstAssignableIp(){
        this.ipData['firstIpDec'] = [...this.ipData['networkIdDec']]
        this.ipData['firstIpDec'][3] = this.ipData['firstIpDec'][3] + 1
        this.ipData['firstIpBin'] = this.convertDecIpToBin(this.ipData['firstIpDec'])
    }
    getLastAssignableIp(){
        let a = this.ipData['networkIdBin'].join('')
        const netid = a.slice(0, this.ipData['subnetMaskLen'])
        const hostid = '1'.repeat(32-this.ipData['subnetMaskLen'] - 1)
        const lastip = netid.concat(hostid, '0')
        this.ipData['lastIpBin'] = []
        this.ipData['lastIpBin'].push( lastip.slice(0,8) )
        this.ipData['lastIpBin'].push( lastip.slice(8,16) )
        this.ipData['lastIpBin'].push( lastip.slice(16,24) )
        this.ipData['lastIpBin'].push( lastip.slice(24,32) )
        this.ipData['lastIpDec'] = this.convertBinIpToDec( this.ipData['lastIpBin'] )
    }
    getBroadcastIp(){
        this.ipData['broadcastIpDec'] = this.ipData['lastIpDec'].slice(0,3)
        this.ipData['broadcastIpDec'].push( this.ipData['lastIpDec'][3] + 1 )
        this.ipData['broadcastIpBin'] = this.convertDecIpToBin( this.ipData['broadcastIpDec'] )
    }
    getHostCount(){
        this.ipData['hostCount'] = parseInt('1'.repeat(32-this.ipData['subnetMaskLen']),2)-1
    }
    splitIP(ipStr) {
        this.ipValid = false
        const sp1 = ipStr.split('/')
        if(sp1.length != 2 || sp1[1].trim()=='') {
            return false
        }
        this.ipData['subnetMaskLen'] = ~~sp1.pop()
        if(this.ipData['subnetMaskLen'] > 31 || this.ipData['subnetMaskLen'] < 0){
            return false
        }
        const sp2 = sp1[0].split('.')
        if(sp2.length != 4){
            return false
        }
        this.ipData['ipDec'] = []
        for( let idx = 0; idx < 4; idx++){
            let digit = ~~sp2[idx]
            if(digit > 255 || digit < 0){
                return false
            }
            this.ipData['ipDec'].push(digit)
        }
        //this.ipSplited = sp2
        this.ipData['ipBin'] = this.convertDecIpToBin( this.ipData['ipDec'] )
        this.ipValid = true
        
        return true
    }

    //for input '192.168.1.137', return []
    convertDecIpToBin(ipArrayDecmal){
        let ipArray = []
        for(let idx = 0; idx < ipArrayDecmal.length; idx++){
            let tmpStr = (~~ipArrayDecmal[idx]).toString(2)
            tmpStr = '0'.repeat(8-tmpStr.length) + tmpStr
            ipArray.push(tmpStr)
        }
        return ipArray
    }

    convertBinIpToDec(ipArrayBin){
        let ipArrayDec = []
        for( let idx = 0; idx < ipArrayBin.length; idx++){
            ipArrayDec.push( parseInt( ipArrayBin[idx], 2 ) )
        }
        return ipArrayDec
    }
}
function convertIpV4(ip){
    myip = new ipV4(ip)

    //console.log(myip.ipData)
    console.log('ip address:\t', myip.ipDec, '\t', myip.ipBin) 
    console.log('subnet mask:\t', myip.subnetMaskDec, '\t', myip.subnetMaskBin) 
    console.log('network id:\t', myip.networkIdDec, '\t', myip.networkIdBin )
    console.log('first ip:\t', myip.firstAssignableIpDec, '\t', myip.firstAssignableIpBin)
    console.log('last ip:\t', myip.lastAssignableIpDec, '\t', myip.lastAssignableIpBin)
    console.log('boradcast ip:\t', myip.broadcastIpDec, '\t', myip.broadcastIpBin)
}

function convertIpV4Html(){
    ip = document.getElementById('ipAddr').value
    myip = new ipV4(ip)
    if( ! myip.ipValid ){
        alert('Invalid IP address')
        return
    }
    //document.getElementById('result').innerText = 'Convert ' + ip
    //document.getElementById('result').innerText += '\nip address\t' + myip.ipDec +'\t' + myip.ipBin
    document.getElementById('ipAddrDec').innerText = myip.ipDec
    document.getElementById('ipAddrBin').innerText = myip.ipBin

    document.getElementById('subnetMaskDec').innerText = myip.subnetMaskDec
    document.getElementById('subnetMaskBin').innerText = myip.subnetMaskBin

    document.getElementById('networkIdDec').innerText = myip.networkIdDec
    document.getElementById('networkIdBin').innerText = myip.networkIdBin

    document.getElementById('firstIpDec').innerText = myip.firstAssignableIpDec
    document.getElementById('firstIpBin').innerText = myip.firstAssignableIpBin

    document.getElementById('lastIpDec').innerText = myip.lastAssignableIpDec
    document.getElementById('lastIpBin').innerText = myip.lastAssignableIpBin

    document.getElementById('broadcastIpDec').innerText = myip.broadcastIpDec
    document.getElementById('broadcastIpBin').innerText = myip.broadcastIpBin

    document.getElementById('hostCount').innerText = myip.hostCount

    //console.log(myip.ipData)
    console.log('-'.repeat(40))
    console.log('ip address:\t', myip.ipDec, '\t', myip.ipBin) 
    console.log('subnet mask:\t', myip.subnetMaskDec, '\t', myip.subnetMaskBin) 
    console.log('network id:\t', myip.networkIdDec, '\t', myip.networkIdBin )
    console.log('first ip:\t', myip.firstAssignableIpDec, '\t', myip.firstAssignableIpBin)
    console.log('last ip:\t', myip.lastAssignableIpDec, '\t', myip.lastAssignableIpBin)
    console.log('boradcast ip:\t', myip.broadcastIpDec, '\t', myip.broadcastIpBin)
}


    
