import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadReport } from '../services/productService';

const reports = [
  {
    id: 'general',
    title: 'Inventario General',
    description: 'Reporte completo de todos los productos con stock de ambos kioscos.',
    icon: '📊',
    type: 'general',
  },
  {
    id: 'critical',
    title: 'Stock Crítico',
    description: 'Productos con menos de 5 unidades en algún kiosco.',
    icon: '⚠️',
    type: 'critical-stock',
  },
  {
    id: 'piso2',
    title: 'Inventario Kiosco Piso 2',
    description: 'Detalle de stock y disponibilidad del Kiosco Piso 2.',
    icon: '📍',
    type: 'kiosk/piso2',
  },
  {
    id: 'piso7',
    title: 'Inventario Kiosco Piso 7',
    description: 'Detalle de stock y disponibilidad del Kiosco Piso 7.',
    icon: '📍',
    type: 'kiosk/piso7',
  },
];

const ReportsPage = () => {
  const [loadingId, setLoadingId] = useState(null);

  const handleDownload = async (report) => {
    setLoadingId(report.id);
    try {
      await downloadReport(report.type);
      toast.success(`Reporte "${report.title}" descargado exitosamente`);
    } catch (err) {
      toast.error(`Error al generar el reporte: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
        <p className="text-brand-gray-500 text-sm mt-1">Descarga reportes de inventario en formato Excel (.xlsx)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-brand-card rounded-2xl border border-brand-border p-6 hover:border-brand-red/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-2xl flex-shrink-0">
                {report.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-brand-red-light transition-colors">{report.title}</h3>
                <p className="text-xs text-brand-gray-500 mt-1 leading-relaxed">{report.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(report)}
              disabled={loadingId === report.id}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-sm font-medium text-white hover:bg-brand-red hover:border-brand-red hover:shadow-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingId === report.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Excel
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-5">
        <div className="flex items-center gap-2 mb-2">
          <FileSpreadsheet className="w-4 h-4 text-brand-red" />
          <h3 className="text-sm font-semibold text-white">Información</h3>
        </div>
        <ul className="text-xs text-brand-gray-500 space-y-1">
          <li>• Los reportes se generan en formato Excel (.xlsx) compatible con Microsoft Excel y Google Sheets.</li>
          <li>• El reporte de stock crítico incluye productos con menos de 5 unidades en cualquier kiosco.</li>
          <li>• Los datos reflejan el estado actual del inventario al momento de la descarga.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsPage;
