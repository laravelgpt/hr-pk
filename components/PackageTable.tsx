import React from 'react';
import { PackageInfo } from '../types';
import EditableCell from './EditableCell';

interface PackageTableProps {
  packages: PackageInfo[];
  tableHeaders: string[];
  onUpdate: (index: number, field: keyof Omit<PackageInfo, 'id' | 'features'>, value: string) => void;
  onUpdateHeader: (index: number, value: string) => void;
  onAddFeature: (packageIndex: number) => void;
  onDeleteFeature: (packageIndex: number, featureIndex: number) => void;
  onUpdateFeature: (packageIndex: number, featureIndex: number, newValue: string) => void;
  onDeletePackage: (index: number) => void;
  pendingDeletionIndex: number | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  headerColor: string;
  priceColor: string;
  tableGradientFrom: string;
  tableGradientVia: string;
  tableGradientTo: string;
  packageTextColor: string;
  detailsTextColor: string;
}

const PackageTable: React.FC<PackageTableProps> = ({ 
    packages, 
    tableHeaders,
    onUpdate, 
    onUpdateHeader,
    onAddFeature,
    onDeleteFeature,
    onUpdateFeature,
    onDeletePackage,
    pendingDeletionIndex,
    onConfirmDelete,
    onCancelDelete,
    headerColor, 
    priceColor, 
    tableGradientFrom, 
    tableGradientVia, 
    tableGradientTo,
    packageTextColor,
    detailsTextColor
}) => {
  return (
    <div className="shadow-2xl rounded-xl border border-gray-200 overflow-hidden">
      {/* Header for Medium screens and up */}
      <div 
        className="hidden md:grid md:grid-cols-6 text-white font-bold uppercase tracking-wider transition-colors duration-300"
        style={{ backgroundColor: headerColor }}
      >
        <EditableCell
          initialValue={tableHeaders[0]}
          onSave={(value) => onUpdateHeader(0, value)}
          className="p-4 justify-start font-bold"
          inputClassName="w-full bg-transparent text-left outline-none border-b-2 border-white/50"
          disableHoverEffect={true}
          style={{ color: 'white' }}
        />
        <EditableCell
          initialValue={tableHeaders[1]}
          onSave={(value) => onUpdateHeader(1, value)}
          className="p-4 justify-start font-bold"
          inputClassName="w-full bg-transparent text-left outline-none border-b-2 border-white/50"
          disableHoverEffect={true}
          style={{ color: 'white' }}
        />
        <EditableCell
          initialValue={tableHeaders[2]}
          onSave={(value) => onUpdateHeader(2, value)}
          className="p-4 justify-start font-bold"
          inputClassName="w-full bg-transparent text-left outline-none border-b-2 border-white/50"
          disableHoverEffect={true}
          style={{ color: 'white' }}
        />
        <EditableCell
          initialValue={tableHeaders[3]}
          onSave={(value) => onUpdateHeader(3, value)}
          className="p-4 justify-end font-bold"
          inputClassName="w-full bg-transparent text-right outline-none border-b-2 border-white/50"
          disableHoverEffect={true}
          style={{ color: 'white' }}
        />
        <EditableCell
          initialValue={tableHeaders[4]}
          onSave={(value) => onUpdateHeader(4, value)}
          className="p-4 justify-end font-bold"
          inputClassName="w-full bg-transparent text-right outline-none border-b-2 border-white/50"
          disableHoverEffect={true}
          style={{ color: 'white' }}
        />
        <div className="p-4 justify-end font-bold text-right">Actions</div>
      </div>

      {/* Body: Cards on mobile, Table rows on desktop */}
      <div className="space-y-3 md:space-y-0 p-2 md:p-0 bg-gray-100 md:bg-transparent md:divide-y md:divide-gray-200">
        {packages.map((pkg, index) => {
          const isPendingDelete = pendingDeletionIndex === index;
          
          const cardStyle = isPendingDelete ? {
            backgroundColor: '#fee2e2', // tailwind red-100
          } : {
            '--gradient-from': tableGradientFrom,
            '--gradient-via': tableGradientVia,
            '--gradient-to': tableGradientTo,
            backgroundImage: `linear-gradient(to right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
          };

          return (
          <div
            key={pkg.id}
            className={`block md:grid md:grid-cols-6 md:items-center transition-all duration-300 ${isPendingDelete ? 'bg-red-100' : ''}`}
          >
            <div
              className={`rounded-lg md:rounded-none md:contents shadow-lg md:shadow-none transition-all duration-300 ${!isPendingDelete && 'hover:brightness-95'}`}
              style={cardStyle as React.CSSProperties}
            >
              {/* Col 1: Name */}
              <div className="p-4 md:py-2 md:px-4 flex items-center md:min-h-[56px]">
                <EditableCell
                  initialValue={pkg.name}
                  onSave={(value) => onUpdate(index, 'name', value)}
                  className="font-semibold w-full justify-start text-left text-lg md:text-base"
                  style={{ color: packageTextColor }}
                  disabled={isPendingDelete}
                />
              </div>

              {/* Col 2: Features */}
              <div className="px-4 pb-2 md:py-2 md:px-4 flex justify-between items-start md:items-center md:min-h-[56px]">
                <span className="text-sm font-bold text-gray-600 md:hidden pt-1">{tableHeaders[1]}:</span>
                <div className="flex flex-wrap items-center gap-2 flex-1 justify-end md:justify-start" style={{ color: detailsTextColor }}>
                  {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                          <EditableCell
                              initialValue={feature}
                              onSave={(newValue) => onUpdateFeature(index, featureIndex, newValue)}
                              className="text-sm"
                              inputClassName="bg-transparent text-sm outline-none"
                              disableHoverEffect={true}
                              disabled={isPendingDelete}
                          />
                          <button
                              onClick={() => onDeleteFeature(index, featureIndex)}
                              aria-label={`Remove ${feature} feature`}
                              className="action-button ml-2 text-gray-500 hover:text-red-500 focus:outline-none rounded-full hover:bg-red-100 p-0.5 transition-colors"
                              disabled={isPendingDelete}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            </svg>
                          </button>
                      </div>
                  ))}
                  <button
                      onClick={() => onAddFeature(index)}
                      aria-label="Add new feature"
                      className="action-button flex items-center justify-center w-6 h-6 bg-green-200 text-green-800 rounded-full hover:bg-green-300 transition-colors focus:outline-none"
                      disabled={isPendingDelete}
                  >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                      </svg>
                  </button>
                </div>
              </div>

              {/* Col 3: Details */}
              <div className="px-4 pb-4 md:py-2 md:px-4 flex justify-between items-center md:items-center md:min-h-[56px] border-b border-gray-300/50 md:border-b-0">
                <span className="text-sm font-bold text-gray-600 md:hidden">{tableHeaders[2]}:</span>
                <EditableCell
                  initialValue={pkg.details}
                  onSave={(value) => onUpdate(index, 'details', value)}
                  className="text-sm w-auto text-right md:w-full md:text-left"
                  style={{ color: detailsTextColor }}
                  disabled={isPendingDelete}
                />
              </div>

              {/* Col 4: Buy Price */}
              <div className="px-4 py-3 md:py-2 md:px-4 flex justify-between items-center md:justify-end md:min-h-[56px]">
                <span className="text-sm font-bold text-gray-600 md:hidden">{tableHeaders[3]}:</span>
                <EditableCell
                  initialValue={`${pkg.price} SR`}
                  onSave={(value) => onUpdate(index, 'price', value)}
                  className="font-bold text-lg"
                  isNumeric={true}
                  style={{ color: priceColor }}
                  disabled={isPendingDelete}
                />
              </div>

              {/* Col 5: Sell Price */}
              <div className="px-4 py-3 bg-black/5 md:bg-transparent rounded-b-lg md:rounded-b-none flex justify-between items-center md:justify-end md:min-h-[56px]">
                <span className="text-sm font-bold text-gray-600 md:hidden">{tableHeaders[4]}:</span>
                <EditableCell
                  initialValue={`${pkg.sellPrice} SR`}
                  onSave={(value) => onUpdate(index, 'sellPrice', value)}
                  className="font-bold text-lg"
                  isNumeric={true}
                  style={{ color: priceColor }}
                  disabled={isPendingDelete}
                />
              </div>

              {/* Col 6: Actions */}
              <div className="px-4 py-2 md:p-2 flex justify-end md:justify-center items-center">
                  {isPendingDelete ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onConfirmDelete}
                            className="action-button px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onCancelDelete}
                            className="action-button px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                    </div>
                  ) : (
                    <button
                        onClick={() => onDeletePackage(index)}
                        aria-label={`Delete ${pkg.name} package`}
                        className="action-button p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                  )}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default PackageTable;