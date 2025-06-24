export const environment = {
    Production: false,
    DebugMode: true,

    ActiveDirectory: {
        auth: {
            clientId: '11a7a763-48d7-4e32-819e-55fd5b7be8c1',
            authority: 'https://login.microsoftonline.com/76d81621-b9a9-4786-bb8f-a2efa839eee2',
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