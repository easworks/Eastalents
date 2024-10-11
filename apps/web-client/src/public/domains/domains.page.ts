import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { Domain } from "@easworks/models/domain";
import { achievements } from "../common/achievements";

@Component({
    standalone:true,
    changeDetection:ChangeDetectionStrategy.OnPush,
    selector:'domains-page',
    templateUrl:'./domains.page.html',
    styleUrl:'./domains.page.less',
    imports:[ImportsModule]
})

export class DomainsPageComponent{

protected readonly domain$ = input.required<Domain>({alias:'domain'});
protected readonly achievements = achievements;


}