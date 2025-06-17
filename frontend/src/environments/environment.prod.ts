export const environment = {
    Production: false,
    DebugMode: true,

    ActiveDirectory: {
        auth: {
            clientId: '<clientId>',
            authority: 'https://login.microsoftonline.com/<tenantId>',
            redirectUri: 'http://localhost:4200'
        },
        defaultScopes: ['user.read'],
        forceRefresh: true,
        refreshTokenExpirationOffsetSeconds: 3000 
    },
    AppProps:{
        //navType: "white",
        //navType: "blue",
        //navType: "white-1",
        navType: "white", 
        logoFile: "logo-coppel.svg",
        bannerFile: "banner.jpg",
        useLoginScreen: true,
        hideSidebarHeader: true,
    }
}