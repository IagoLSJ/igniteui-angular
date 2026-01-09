import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { 
    IgxComboComponent, IgxSimpleComboComponent, IgxToastComponent, 
    OverlaySettings, VerticalAlignment, IForOfState, 
    IComboSelectionChangingEventArgs, ISimpleComboSelectionChangingEventArgs 
} from 'igniteui-angular';
import type { IStateItem, IMovieGenre, IFalsyData } from './models/combo-models';
import { ComboDataService } from './service/combo-data.service';
import { RemoteNWindService } from './remote-nwind.service';

@Component({
    selector: 'combo-sample',
    templateUrl: './combo.sample.html',
    providers: [ComboDataService]
})
export class ComboSampleComponent implements OnInit, AfterViewInit {
    @ViewChild('playgroundCombo', { static: true }) public igxCombo!: IgxComboComponent;
    @ViewChild('remoteCombo') public remoteCombo!: IgxComboComponent;
    @ViewChild('loadingToast') public loadingToast!: IgxToastComponent;

    // Dados Tipados
    public items: IStateItem[] = [];
    public genres: IMovieGenre[] = [];
    public userForm: FormGroup;
    public uniqueFalsyData: IFalsyData[] = [];
    
    // Gerenciamento de Estado de Virtualização
    private readonly defaultVirtState: IForOfState = { chunkSize: 6, startIndex: 0 };
    private remoteSubscription?: Subscription;
    private searchText = '';

    constructor(
        private dataService: ComboDataService,
        private remoteService: RemoteNWindService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.items = this.dataService.getStates();
        this.genres = this.dataService.getGenres();
        
        // Typed Form
        this.userForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            genres: [[], Validators.required],
            movie: ['', Validators.required]
        });
    }
    public ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {
        this.initializeData();
    }

    private initializeData(): void {
        this.uniqueFalsyData = [
            { field: 'null', value: null },
            { field: 'undefined', value: undefined },
            { field: 'empty', value: '' }
        ];
    }

    // Refatoração da Lógica de Busca Remota (Unificada)
    public loadRemoteData(combo: IgxComboComponent | IgxSimpleComboComponent): void {
        if (this.remoteSubscription) {
            this.remoteSubscription.unsubscribe();
        }

        this.showLoading('Loading Remote Data...');

        this.remoteSubscription = this.remoteService.getData(
            combo.virtualizationState,
            this.searchText,
            (data: any) => {
                combo.totalItemCount = data['@odata.count'];
                this.loadingToast.close();
                this.cdr.detectChanges();
            }
        );
    }

    private showLoading(message: string): void {
        this.loadingToast.positionSettings.verticalDirection = VerticalAlignment.Middle;
        this.loadingToast.autoHide = false;
        this.loadingToast.open(message);
    }

    public handleSelection(evt: IComboSelectionChangingEventArgs | ISimpleComboSelectionChangingEventArgs): void {
        // Lógica simplificada de verificação de seleção
        const hasValue = 'added' in evt ? evt.newSelection.length > 0 : !!evt.newValue;
        console.log('Has selection:', hasValue);
    }
}