function FindProxyForURL(url, host)
{
    JUPOPSProxy = "PROXY 172.16.6.131:8081";
 
    if (shExpMatch(host, "jovian.scgw.jupiterhts.net")) {
        return "DIRECT";
    }

    if (shExpMatch(host, '*.scgw.jupiterhts.net') || dnsDomainIs(host, '.scgw.jupiterhts.net') || dnsDomainIs(host, '.terminal.scgw.jupiterhts.net')) {
        return JUPOPSProxy;
    }

    // Default to direct connection
    return "DIRECT";
}
