import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";

@Component({
    standalone:true,
    changeDetection:ChangeDetectionStrategy.OnPush,
    selector:'domains-page',
    templateUrl:'./domains.page.html',
    styleUrl:'./domains.page.less',
    imports:[ImportsModule]
})

export class DomainsPageComponent{



}