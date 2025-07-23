import React, { useState, useRef, useCallback } from 'react';
import { PackageInfo, AppColors } from './types';
import { INITIAL_PACKAGES, DEFAULT_COLORS, INITIAL_TABLE_HEADERS } from './constants';
import Header from './components/Header';
import PackageTable from './components/PackageTable';
import { GoogleGenAI, Type } from "@google/genai";


declare global {
    interface Window {
        html2canvas: any;
    }
}

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
        aria-label={`Select ${label}`}
      />
      <input 
        type="text"
        value={color.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono bg-gray-50 rounded-md p-2 text-center text-gray-700 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        title="Enter a valid hex color code (e.g., #RRGGBB)"
        aria-label={`${label} hex code`}
      />
    </div>
  </div>
);

const App: React.FC = () => {
  const [packages, setPackages] = useState<PackageInfo[]>(INITIAL_PACKAGES);
  const [headerTitle, setHeaderTitle] = useState('SALAM');
  const [tableHeaders, setTableHeaders] = useState<string[]>(INITIAL_TABLE_HEADERS);
  const [isDownloading, setIsDownloading] = useState(false);
  const [colors, setColors] = useState<AppColors>(DEFAULT_COLORS);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isGeneratingGradient, setIsGeneratingGradient] = useState(false);
  const [isGeneratingUIColors, setIsGeneratingUIColors] = useState(false);
  const [pendingDeletionIndex, setPendingDeletionIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleUpdateHeaderTitle = useCallback((newTitle: string) => {
    setHeaderTitle(newTitle);
  }, []);

  const handleUpdateTableHeader = useCallback((index: number, value: string) => {
    // Prevent empty headers, revert to initial if cleared
    const finalValue = value.trim() === '' ? INITIAL_TABLE_HEADERS[index] : value;
    setTableHeaders(currentHeaders => {
      const newHeaders = [...currentHeaders];
      newHeaders[index] = finalValue;
      return newHeaders;
    });
  }, []);

  const handleUpdatePackage = useCallback((index: number, field: keyof Omit<PackageInfo, 'id' | 'features'>, value: string) => {
    setPackages(currentPackages => {
        const newPackages = [...currentPackages];
        const updatedPackage = { ...newPackages[index] };

        if (field === 'price' || field === 'sellPrice') {
            const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
            updatedPackage[field] = isNaN(numericValue) ? newPackages[index][field] : numericValue;
        } else {
            (updatedPackage as any)[field] = value;
        }
        
        newPackages[index] = updatedPackage;
        return newPackages;
    });
  }, []);

  const handleAddFeature = useCallback((packageIndex: number) => {
    setPackages(currentPackages => {
        const newPackages = [...currentPackages];
        const targetPackage = { ...newPackages[packageIndex] };
        targetPackage.features = [...targetPackage.features, 'New Feature'];
        newPackages[packageIndex] = targetPackage;
        return newPackages;
    });
  }, []);
    
  const handleDeleteFeature = useCallback((packageIndex: number, featureIndex: number) => {
    setPackages(currentPackages => {
        const newPackages = [...currentPackages];
        const targetPackage = { ...newPackages[packageIndex] };
        targetPackage.features = targetPackage.features.filter((_, idx) => idx !== featureIndex);
        newPackages[packageIndex] = targetPackage;
        return newPackages;
    });
  }, []);
    
  const handleUpdateFeature = useCallback((packageIndex: number, featureIndex: number, newValue: string) => {
    setPackages(currentPackages => {
        const newPackages = [...currentPackages];
        const targetPackage = { ...newPackages[packageIndex] };
        const newFeatures = [...targetPackage.features];
        newFeatures[featureIndex] = newValue.trim() === '' ? 'Feature' : newValue;
        targetPackage.features = newFeatures;
        newPackages[packageIndex] = targetPackage;
        return newPackages;
    });
  }, []);

  const handleAddPackage = useCallback(() => {
    setPackages(currentPackages => {
      const newId = Math.max(0, ...currentPackages.map(p => p.id)) + 1;
      const newPackage: PackageInfo = {
        id: newId,
        name: 'New Package',
        features: ['Editable Feature'],
        details: 'Data and minutes info',
        price: 0,
        sellPrice: 0,
      };
      return [...currentPackages, newPackage];
    });
  }, []);

  const handleInitiateDelete = useCallback((packageIndex: number) => {
    setPendingDeletionIndex(packageIndex);
  }, []);

  const confirmDeletePackage = useCallback(() => {
    if (pendingDeletionIndex !== null) {
      setPackages(currentPackages => currentPackages.filter((_, idx) => idx !== pendingDeletionIndex));
      setPendingDeletionIndex(null);
    }
  }, [pendingDeletionIndex]);

  const cancelDeletePackage = useCallback(() => {
    setPendingDeletionIndex(null);
  }, []);

  const handleDownloadImage = useCallback(() => {
    if (tableRef.current && window.html2canvas) {
      setIsDownloading(true);
      // Temporarily hide action buttons before taking screenshot
      const actionButtons = tableRef.current.querySelectorAll('.action-button');
      actionButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');
      
      window.html2canvas(tableRef.current, {
        useCORS: true,
        scale: 2, 
        backgroundColor: '#f3f4f6',
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `${headerTitle.toLowerCase().replace(/\s+/g, '-')}-packages.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsDownloading(false);
        // Show action buttons again
        actionButtons.forEach(btn => (btn as HTMLElement).style.display = '');
      }).catch((err: any) => {
        console.error("Failed to download image:", err);
        setIsDownloading(false);
        // Show action buttons again if there was an error
        actionButtons.forEach(btn => (btn as HTMLElement).style.display = '');
      });
    } else {
        console.error("Table reference not found or html2canvas not loaded.");
    }
  }, [headerTitle]);

  const handleColorChange = useCallback((key: keyof AppColors, value: string) => {
    setColors(prevColors => ({
      ...prevColors,
      [key]: value
    }));
  }, []);

  const resetColors = useCallback(() => {
    setColors(DEFAULT_COLORS);
    setPendingDeletionIndex(null);
  }, []);

  const handleGenerateUIColors = useCallback(async () => {
    setIsGeneratingUIColors(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a cohesive and accessible color palette for a web application UI. Provide hex color codes for primary actions, header text, table header background, price text, main package text, and secondary details text. Ensure good contrast and a professional, modern feel.',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING, description: 'The primary color for buttons and accents.' },
                        headerText: { type: Type.STRING, description: 'The text color for the main header.' },
                        tableHeader: { type: Type.STRING, description: 'The background color for the table header.' },
                        priceText: { type: Type.STRING, description: 'The color for price text to make it stand out.' },
                        packageText: { type: Type.STRING, description: 'The main text color for package names.' },
                        detailsText: { type: Type.STRING, description: 'The secondary text color for package details.' }
                    },
                    required: ['primary', 'headerText', 'tableHeader', 'priceText', 'packageText', 'detailsText']
                }
            }
        });
        
        const uiColors = JSON.parse(response.text);

        if (uiColors.primary && uiColors.headerText && uiColors.tableHeader && uiColors.priceText && uiColors.packageText && uiColors.detailsText) {
            setColors(prevColors => ({
                ...prevColors,
                primary: uiColors.primary,
                headerText: uiColors.headerText,
                tableHeader: uiColors.tableHeader,
                priceText: uiColors.priceText,
                packageText: uiColors.packageText,
                detailsText: uiColors.detailsText,
            }));
        } else {
             throw new Error("Invalid data structure in AI response for UI colors");
        }
    } catch (error) {
        console.error('Error generating UI colors:', error);
        alert('Failed to generate new UI colors. The AI might be busy or an error occurred. Please try again.');
    } finally {
        setIsGeneratingUIColors(false);
    }
  }, []);

  const handleGenerateGradient = useCallback(async () => {
    setIsGeneratingGradient(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a pleasant and harmonious color gradient for a table row background. Provide three very light, soft, and complementary hex color codes (e.g., #RRGGBB).',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        from: { type: Type.STRING, description: 'The starting hex color code for the gradient.' },
                        via: { type: Type.STRING, description: 'The middle hex color code for the gradient.' },
                        to: { type: Type.STRING, description: 'The ending hex color code for the gradient.' }
                    },
                    required: ['from', 'via', 'to']
                }
            }
        });
        
        const gradientColors = JSON.parse(response.text);

        if (gradientColors.from && gradientColors.via && gradientColors.to) {
            setColors(prevColors => ({
                ...prevColors,
                tableGradientFrom: gradientColors.from,
                tableGradientVia: gradientColors.via,
                tableGradientTo: gradientColors.to,
            }));
        } else {
             throw new Error("Invalid data structure in AI response");
        }
    } catch (error) {
        console.error('Error generating gradient:', error);
        alert('Failed to generate a new gradient. The AI might be busy or an error occurred. Please try again.');
    } finally {
        setIsGeneratingGradient(false);
    }
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div ref={tableRef} className="bg-gray-100 pb-4">
            <Header 
              title={headerTitle} 
              onUpdateTitle={handleUpdateHeaderTitle} 
              primaryColor={colors.primary}
              textColor={colors.headerText}
            />
            <PackageTable 
              packages={packages} 
              tableHeaders={tableHeaders}
              onUpdate={handleUpdatePackage} 
              onUpdateHeader={handleUpdateTableHeader}
              onAddFeature={handleAddFeature}
              onDeleteFeature={handleDeleteFeature}
              onUpdateFeature={handleUpdateFeature}
              onDeletePackage={handleInitiateDelete}
              pendingDeletionIndex={pendingDeletionIndex}
              onConfirmDelete={confirmDeletePackage}
              onCancelDelete={cancelDeletePackage}
              headerColor={colors.tableHeader}
              priceColor={colors.priceText}
              tableGradientFrom={colors.tableGradientFrom}
              tableGradientVia={colors.tableGradientVia}
              tableGradientTo={colors.tableGradientTo}
              packageTextColor={colors.packageText}
              detailsTextColor={colors.detailsText}
            />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-expanded={isPanelOpen}
            aria-controls="customization-panel"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 sm:px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Customize
          </button>
           <button
            onClick={handleAddPackage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Add Package
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            style={{ backgroundColor: colors.primary }}
            className="text-white font-bold py-3 px-6 sm:px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : 'Download as Image'}
          </button>
        </div>

        {isPanelOpen && (
          <div id="customization-panel" className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Customize Appearance</h3>
                <button
                    onClick={resetColors}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Reset to Defaults
                </button>
            </div>
            
            <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">UI Colors</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <ColorPicker label="Primary Color" color={colors.primary} onChange={(c) => handleColorChange('primary', c)} />
                    <ColorPicker label="Header Text" color={colors.headerText} onChange={(c) => handleColorChange('headerText', c)} />
                    <ColorPicker label="Table Header" color={colors.tableHeader} onChange={(c) => handleColorChange('tableHeader', c)} />
                    <ColorPicker label="Price Text" color={colors.priceText} onChange={(c) => handleColorChange('priceText', c)} />
                    <ColorPicker label="Package Name Text" color={colors.packageText} onChange={(c) => handleColorChange('packageText', c)} />
                    <ColorPicker label="Details Text" color={colors.detailsText} onChange={(c) => handleColorChange('detailsText', c)} />
                </div>
                 <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h5 className="text-lg font-bold text-gray-800">AI-Powered Theme</h5>
                            <p className="text-sm text-gray-600 mt-1">
                                Let AI generate a new color theme for the UI components.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateUIColors}
                            disabled={isGeneratingUIColors}
                            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isGeneratingUIColors ? 'Generating...' : '✨ Generate UI Colors'}
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Table Row Background</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    <ColorPicker label="Gradient From" color={colors.tableGradientFrom} onChange={(c) => handleColorChange('tableGradientFrom', c)} />
                    <ColorPicker label="Gradient Via" color={colors.tableGradientVia} onChange={(c) => handleColorChange('tableGradientVia', c)} />
                    <ColorPicker label="Gradient To" color={colors.tableGradientTo} onChange={(c) => handleColorChange('tableGradientTo', c)} />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h5 className="text-lg font-bold text-gray-800">AI-Powered Gradient</h5>
                            <p className="text-sm text-gray-600 mt-1">
                                Let AI generate a new harmonious background gradient for you.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateGradient}
                            disabled={isGeneratingGradient}
                            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isGeneratingGradient ? 'Generating...' : '✨ Generate with AI'}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;