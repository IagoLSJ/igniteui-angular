import { Injectable, inject } from '@angular/core';
import { 
    IgxExcelExporterService, IgxCsvExporterService, IgxExcelExporterOptions, 
    IgxCsvExporterOptions, CsvFileTypes, IgxGridComponent 
} from 'igniteui-angular';

import { ExportFormat } from './grid.models';


@Injectable({ providedIn: 'root' })
export class GridExportService {
    private excelExporter = inject(IgxExcelExporterService);
    private csvExporter = inject(IgxCsvExporterService);

    public export(grid: IgxGridComponent, format: ExportFormat, fileName: string): void {
        const options = this.getOptions(format, fileName);
        const service = format === 'XLSX' ? this.excelExporter : this.csvExporter;
        service.export(grid, options);
    }

    private getOptions(format: ExportFormat, fileName: string) {
        if (format === 'XLSX') return new IgxExcelExporterOptions(fileName);
        
        const fileType = format === 'CSV' ? CsvFileTypes.CSV : 
                         format === 'TSV' ? CsvFileTypes.TSV : CsvFileTypes.TAB;
        return new IgxCsvExporterOptions(fileName, fileType);
    }
}