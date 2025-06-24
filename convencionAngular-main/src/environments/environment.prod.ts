export const environment = {
    Production: false,
    DebugMode: true,

    ActiveDirectory: {
        auth: {
            clientId: 'be9b24f1-745d-4d15-97b3-3ae615529471',
            authority: 'https://login.microsoftonline.com/20352d16-9134-4df5-a4c0-440ddb0b8585',
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