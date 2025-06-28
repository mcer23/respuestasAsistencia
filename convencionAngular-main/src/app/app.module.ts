import { NgModel } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { protectedComponent } from "./components/routes/protected/protected.component";


@NgModel({
    declarations:[
        AppComponent,
        protectedComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap:[AppComponent]
})

export class AppModule{ }