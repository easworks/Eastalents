import { ChangeDetectionStrategy, Component, INJECTOR, OnInit, inject } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormImportsModule } from "@easworks/app-shell/common/form.imports.module";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { generateLoadingState } from "@easworks/app-shell/state/loading";
import { faCheck, faRefresh, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { Store } from "@ngrx/store";
import { FeaturedProduct, updateDisplayFeatureProduct } from "./models/featured";
import { ADMIN_DATA_FEATURE, featureProduct } from "./state/admin-data";


import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { Domain } from "./models/domain";
import { SoftwareProduct } from "./models/tech-skill";

@Component({
    standalone: true,
    selector: 'feature-product-page',
    templateUrl: './feature-product.page.html',
    //styleUrl: './tech-group.page.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImportsModule,
        FormImportsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule,

        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,

        MatFormFieldModule,

        MatChipsModule, CdkDropList, CdkDrag
    ]
})



export class FeatureProductComponent implements OnInit {



    private readonly store = inject(Store);
    private readonly snackbar = inject(MatSnackBar);
    private readonly injector = inject(INJECTOR);

    protected readonly icons = {
        faCheck,
        faRefresh,
        faSquareXmark
    } as const;

    protected readonly loading = generateLoadingState<[
        'updating new domain in feature product',
        'adding new domain in feature product'
    ]>();


    domain$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectDomains);

    addDomainList: Domain[] = [];
    private readonly softwareProduct = {
        list$: this.store.selectSignal(ADMIN_DATA_FEATURE.selectSoftwareProducts),
    } as const;


    readonly featureProduct$ = this.store.selectSignal(ADMIN_DATA_FEATURE.selectFeatureProduct);

    //protected readonly table = this.initTable();

    featureProductToList: FeaturedProduct = { domain: '', software: [] };

    featureProductToAdd: FeaturedProduct = { domain: '', software: [] };
    softwareListToShow: SoftwareProduct[] = [];
    addSelectedDomain = '';
    disable = true;

    updateProductData: updateDisplayFeatureProduct[] = [];



    ngOnInit(): void {
        this.addDomainList = this.domain$();
        this.intializeUpdateData(this.featureProduct$());
    }

    intializeUpdateData(data: FeaturedProduct[]) {
        data.forEach(x => {

            const domains = this.addDomainList.find(z => z.id === x.domain);
            const updateFp: updateDisplayFeatureProduct = {
                domainId: x.domain,
                domainName: domains != undefined ? domains.longName : '',
                domainData: domains != undefined ? [domains] : [],
                softareId: [],
                softwareProduct: []
            };

            x.software.forEach(y => {
                const data = this.softwareProduct.list$().find(z => z.id === y);
                if (data != undefined) {
                    updateFp.softareId?.push(y);
                    updateFp.softwareProduct?.push(data);
                }
            });


            this.updateProductData.push(updateFp);

            this.addDomainList = this.addDomainList.filter(y => y.id != x.domain);

        });
    }

    onSelectChange(e: MatSelectChange) {
        this.addSelectedDomain = '';
        this.softwareListToShow = [];
        this.addSelectedDomain = e.value;
        const domains = this.addDomainList.find(x => x.id === e.value);
        domains?.products.forEach(x => {
            const data = this.softwareProduct.list$().find(z => z.id === x);
            if (data != undefined) {
                this.softwareListToShow.push(data);
            }
        });
        this.enableDisableSubmitButton();
    }

    drop(event: CdkDragDrop<SoftwareProduct[]>) {
        moveItemInArray(this.softwareListToShow, event.previousIndex, event.currentIndex);
        this.enableDisableSubmitButton();
    }

    submit() {
        this.featureProductToAdd.domain = this.addSelectedDomain;
        const data = this.softwareListToShow.map(x => x.id);
        this.featureProductToAdd.software = data;
        this.store.dispatch(featureProduct.add({ payload: this.featureProductToAdd }));

        this.intializeUpdateData([this.featureProductToAdd]);
        this.featureProductToAdd = { domain: '', software: [] };
        this.addSelectedDomain = '';
        this.softwareListToShow = [];
        this.enableDisableSubmitButton();
    }

    enableDisableSubmitButton() {
        this.disable = true;
        if (this.addSelectedDomain.length && this.softwareListToShow.length) {
            this.disable = false;
        }
    }

    dropUpdate(opt: { e: CdkDragDrop<SoftwareProduct[]>, data: updateDisplayFeatureProduct; }) {
        if (opt.data.softwareProduct === undefined) {
            return;
        }
        moveItemInArray(opt.data.softwareProduct, opt.e.previousIndex, opt.e.currentIndex);

        const payload: FeaturedProduct = {
            domain: opt.data.domainId,
            software: opt.data.softwareProduct.map(x => x.id)
        };
        this.store.dispatch(featureProduct.update({ payload }));
    }
}