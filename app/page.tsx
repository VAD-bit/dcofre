'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileDown, Plus, Printer, Trash2 } from 'lucide-react';

interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

interface ClientData {
  name: string;
  company: string;
  phone: string;
  email: string;
  validUntil: string;
}

const units = ['Unidad', 'Metros (m)', 'Metro Cuadrado (m²)', '1/2', '1/4', '1/8', 'Litros', 'Kg', 'Placas'];
const emptyMaterial = { name: '', quantity: '1', unit: 'Unidad', unitCost: '' };
const emptyClient: ClientData = { name: '', company: '', phone: '', email: '', validUntil: '' };
const money = (value: number | null | undefined) => `$${Number(value ?? 0).toFixed(2)}`;

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialForm, setMaterialForm] = useState(emptyMaterial);
  const [client, setClient] = useState<ClientData>(emptyClient);
  const [labor, setLabor] = useState('');
  const [error, setError] = useState('');

  const materialsSubtotal = materials.reduce((sum, material) => sum + material.quantity * material.unitCost, 0);
  const laborAmount = Number(labor) || 0;
  const total = materialsSubtotal + laborAmount;
  const validUntil = client.validUntil ? new Date(`${client.validUntil}T12:00:00`).toLocaleDateString('es-VE') : 'la fecha indicada';

  const addMaterial = (event: React.FormEvent) => {
    event.preventDefault();
    const name = materialForm.name.trim();
    const quantity = Number(materialForm.quantity);
    const unitCost = Number(materialForm.unitCost);
    if (!name || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost) || unitCost < 0) {
      setError('Completa el material, una cantidad válida y su costo unitario.');
      return;
    }
    setMaterials((current) => [...current, { id: Date.now(), name, quantity, unit: materialForm.unit, unitCost }]);
    setMaterialForm(emptyMaterial);
    setError('');
  };

  const nextFromProduct = (event: React.FormEvent) => {
    event.preventDefault();
    if (!productName.trim()) { setError('Escribe el nombre del mueble o pieza.'); return; }
    setError('');
    setStep(2);
  };

  const nextFromClient = (event: React.FormEvent) => {
    event.preventDefault();
    if (!client.name.trim() || !client.phone.trim() || !client.email.trim() || !client.validUntil) { setError('Completa los datos obligatorios del cliente.'); return; }
    setError('');
    setStep(4);
  };

  const updateClient = (field: keyof ClientData, value: string) => setClient((current) => ({ ...current, [field]: value }));
  const goBack = () => { setError(''); setStep((current) => Math.max(1, current - 1)); };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-800">
      <header className="border-b border-stone-200 bg-white print:hidden"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><Image src="/logo dcofre.png" alt="D'Cofre Muebles" width={190} height={48} priority /><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Área comercial</p><p className="text-sm font-semibold text-stone-700">Asistente de presupuestos</p></div></div></header>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Nueva cotización</p><h1 className="font-serif text-4xl tracking-tight text-stone-900">Presupuesto a medida</h1><p className="mt-2 text-sm text-stone-500">Completa cada etapa para preparar una propuesta formal.</p></div><button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-800"><Printer size={16} /> Descargar PDF / Imprimir</button></div>
        <div className="mb-8 grid grid-cols-4 gap-2 print:hidden">{['Pieza', 'Materiales', 'Cliente', 'Mano de obra'].map((label, index) => <div key={label} className={`border-t-2 pt-2 text-[10px] font-bold uppercase tracking-wider ${step >= index + 1 ? 'border-amber-700 text-stone-800' : 'border-stone-200 text-stone-400'}`}><span className="mr-1">0{index + 1}</span>{label}</div>)}</div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_500px]">
          <section className="min-h-[510px] print:hidden">
            {step === 1 && <div className="wizard-card"><StepHeading number="01" title="Define tu pieza" text="Comencemos con el mueble que deseas cotizar." /><form onSubmit={nextFromProduct} className="mt-8 space-y-5"><label className="label">Nombre del mueble o pieza<input autoFocus required value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Ej. Mesa de comedor, estante..." className="field" /></label>{error && <ErrorText text={error} />}<NextButton> Siguiente: Agregar Materiales <ArrowRight size={16} /></NextButton></form></div>}
            {step === 2 && <div className="wizard-card"><StepHeading number="02" title="Agrega los materiales" text="Registra los insumos necesarios para elaborar la pieza." /><form onSubmit={addMaterial} className="mt-7 space-y-4"><label className="label">Nombre del material<input autoFocus required value={materialForm.name} onChange={(event) => setMaterialForm({ ...materialForm, name: event.target.value })} placeholder="Ej. Madera de roble" className="field" /></label><div className="grid grid-cols-2 gap-3"><label className="label">Cantidad<input required type="number" min="0.01" step="0.01" value={materialForm.quantity} onChange={(event) => setMaterialForm({ ...materialForm, quantity: event.target.value })} className="field" /></label><label className="label">Unidad de medida<select value={materialForm.unit} onChange={(event) => setMaterialForm({ ...materialForm, unit: event.target.value })} className="field">{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label></div><label className="label">Costo por unidad USD<input required type="number" min="0" step="0.01" value={materialForm.unitCost} onChange={(event) => setMaterialForm({ ...materialForm, unitCost: event.target.value })} placeholder="0.00" className="field" /></label>{materialForm.unitCost && <p className="text-right text-xs text-stone-500">Costo total del ítem: <strong className="font-mono text-stone-800">{money(Number(materialForm.quantity || 0) * Number(materialForm.unitCost || 0))}</strong></p>}{error && <ErrorText text={error} />}<button className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"><Plus size={16} /> Añadir material a la lista</button></form><MaterialList materials={materials} onRemove={(id) => setMaterials((current) => current.filter((material) => material.id !== id))} /><div className="mt-7 flex gap-3"><BackButton onClick={goBack} /><NextButton onClick={() => setStep(3)}>Siguiente: Datos del Cliente <ArrowRight size={16} /></NextButton></div></div>}
            {step === 3 && <div className="wizard-card"><StepHeading number="03" title="Datos del cliente" text="Esta información aparecerá en el documento final." /><form onSubmit={nextFromClient} className="mt-8 space-y-4"><label className="label">Nombre del cliente<input autoFocus required value={client.name} onChange={(e) => updateClient('name', e.target.value)} placeholder="Nombre completo" className="field" /></label><label className="label">Empresa / Particular<input value={client.company} onChange={(e) => updateClient('company', e.target.value)} placeholder="Empresa o cliente particular" className="field" /></label><div className="grid grid-cols-2 gap-3"><label className="label">Teléfono<input required value={client.phone} onChange={(e) => updateClient('phone', e.target.value)} placeholder="+58 000 000 0000" className="field" /></label><label className="label">Correo electrónico<input required type="email" value={client.email} onChange={(e) => updateClient('email', e.target.value)} placeholder="cliente@email.com" className="field" /></label></div><label className="label">Validez del presupuesto<input required type="date" value={client.validUntil} onChange={(e) => updateClient('validUntil', e.target.value)} className="field" /></label>{error && <ErrorText text={error} />}<div className="flex gap-3"><BackButton onClick={goBack} /><NextButton>Confirmar datos <ArrowRight size={16} /></NextButton></div></form></div>}
            {step === 4 && <div className="wizard-card"><StepHeading number="04" title="Define la mano de obra" text="Añade el costo de instalación para completar el presupuesto." /><div className="mt-10"><label className="label">Monto de mano de obra / instalación USD<input autoFocus type="number" min="0" step="0.01" value={labor} onChange={(event) => setLabor(event.target.value)} placeholder="0.00" className="field text-lg" /></label><div className="mt-8 border-t border-stone-200 pt-5 text-sm"><div className="flex justify-between text-stone-500"><span>Materiales</span><span className="font-mono">{money(materialsSubtotal)}</span></div><div className="mt-3 flex justify-between text-lg font-semibold text-stone-900"><span>Total general</span><span className="font-mono">{money(total)}</span></div></div><div className="mt-8 flex gap-3"><BackButton onClick={goBack} /><button onClick={() => setStep(4)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-100 hover:bg-stone-800"><Check size={16} /> Presupuesto completado</button></div></div></div>}
          </section>

          <QuotePreview productName={productName} materials={materials} client={client} labor={laborAmount} subtotal={materialsSubtotal} total={total} validUntil={validUntil} />
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs text-stone-400 print:hidden"><FileDown size={14} /> La vista previa se actualiza mientras completas el asistente.</div>
      </div>
    </main>
  );
}

function StepHeading({ number, title, text }: { number: string; title: string; text: string }) { return <div><p className="text-xs font-bold uppercase tracking-widest text-amber-700">Paso {number}</p><h2 className="mt-1 text-2xl font-semibold text-stone-900">{title}</h2><p className="mt-2 text-sm text-stone-500">{text}</p></div>; }
function ErrorText({ text }: { text: string }) { return <p className="text-xs text-red-700">{text}</p>; }
function NextButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button type={onClick ? 'button' : 'submit'} onClick={onClick} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-100 hover:bg-stone-800">{children}</button>; }
function BackButton({ onClick }: { onClick: () => void }) { return <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"><ArrowLeft size={16} /> Atrás</button>; }
function MaterialList({ materials, onRemove }: { materials: Material[]; onRemove: (id: number) => void }) { return <div className="mt-6 border-t border-stone-200 pt-5"><div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-stone-500"><span>Materiales añadidos</span><span>{materials.length}</span></div>{materials.length ? <div className="divide-y divide-stone-100">{materials.map((material) => <div key={material.id} className="flex items-center justify-between py-3 text-sm"><div><span className="font-medium">{material.name}</span><span className="ml-2 text-xs text-stone-500">{material.quantity} {material.unit}</span></div><div className="flex items-center gap-3"><span className="font-mono text-xs">{money(material.quantity * material.unitCost)}</span><button onClick={() => onRemove(material.id)} title="Eliminar material" className="text-stone-400 hover:text-red-700"><Trash2 size={15} /></button></div></div>)}</div> : <p className="py-3 text-sm text-stone-400">Aún no hay materiales añadidos.</p>}</div>; }
function QuotePreview({ productName, materials, client, labor, subtotal, total, validUntil }: { productName: string; materials: Material[]; client: ClientData; labor: number; subtotal: number; total: number; validUntil: string }) { return <section className="quote-document border border-stone-200 bg-white shadow-sm print:border-0 print:shadow-none"><div className="border-b border-stone-200 p-6 sm:p-8"><div className="flex justify-between gap-4"><Image src="/logo dcofre.png" alt="D'Cofre Muebles" width={150} height={38} /><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Cotización</p><p className="mt-1 font-mono text-sm text-stone-700">DC-{new Date().getFullYear()}-001</p></div></div><div className="mt-8"><p className="text-xs font-bold uppercase tracking-widest text-amber-700">Propuesta comercial</p><h2 className="mt-1 font-serif text-3xl text-stone-900">{productName || 'Presupuesto'}</h2><p className="mt-2 text-xs text-stone-500">Fecha: {new Date().toLocaleDateString('es-VE')}</p></div></div><div className="p-6 sm:p-8"><div className="mb-8 grid gap-3 border-b border-stone-200 pb-6 text-sm sm:grid-cols-2"><div><p className="label">Cliente</p><p className="mt-1 min-h-5">{client.name || '—'}</p></div><div><p className="label">Empresa / Particular</p><p className="mt-1 min-h-5">{client.company || '—'}</p></div><div><p className="label">Teléfono</p><p className="mt-1 min-h-5">{client.phone || '—'}</p></div><div><p className="label">Correo</p><p className="mt-1 min-h-5 break-all">{client.email || '—'}</p></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-stone-300 text-[10px] uppercase tracking-widest text-stone-500"><th className="pb-3">Material</th><th className="pb-3 text-center">Cant.</th><th className="pb-3 text-right">Costo unit.</th><th className="pb-3 text-right">Total</th></tr></thead><tbody className="divide-y divide-stone-100">{materials.map((material) => <tr key={material.id}><td className="py-4 font-medium">{material.name}<span className="block text-xs text-stone-400">{material.unit}</span></td><td className="py-4 text-center">{material.quantity}</td><td className="py-4 text-right font-mono text-xs">{money(material.unitCost)}</td><td className="py-4 text-right font-mono text-xs">{money(material.quantity * material.unitCost)}</td></tr>)}<tr className="border-t-2 border-stone-300"><td className="py-4 font-medium">Mano de obra / Instalación</td><td className="py-4 text-center">1</td><td className="py-4 text-right font-mono text-xs">{money(labor)}</td><td className="py-4 text-right font-mono text-xs">{money(labor)}</td></tr></tbody></table>{!materials.length && <p className="py-5 text-center text-xs text-stone-400">Los materiales aparecerán aquí.</p>}</div><div className="ml-auto mt-8 max-w-xs space-y-3 text-sm"><div className="flex justify-between text-stone-500"><span>Subtotal materiales</span><span className="font-mono">{money(subtotal)}</span></div><div className="flex justify-between border-t border-stone-300 pt-3 text-lg font-semibold text-stone-900"><span>Total general</span><span className="font-mono">{money(total)}</span></div></div><div className="mt-12 border-t border-stone-200 pt-4 text-[11px] leading-5 text-stone-500">Gracias por confiar en D&apos;Cofre Muebles. Esta cotización tiene validez hasta {validUntil}.</div></div></section>; }
