export const ModalDifficulty = ({ isOpen, levels, onSelectLevel, isMobile }) => {
    return (
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-40 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white p-12 rounded-lg shadow-2xl flex flex-col gap-6 border-t-8 border-mines-blue text-center w-full max-w-fit">
            <h2 className="text-mines-blue text-3xl font-bold uppercase tracking-tighter">Tamaño del tablero</h2>
            {Object.entries(levels).map(([id, config]) => (
            <button 
                key={id} 
                onClick={() => onSelectLevel(id)} 
                className="bg-[#f6f6f6] border border-[#dddddd] px-12 py-5 rounded text-xl text-mines-blue hover:bg-mines-blue hover:text-white transition-all shadow-md font-bold cursor-pointer uppercase"
            >
                {config.name}
                <br />
                <span className="text-lg font-normal opacity-60 normal-case">
                    {isMobile ? `${config.mobile[0]}x${config.mobile[1]}` : `${config.desktop[0]}x${config.desktop[1]}`} celdas
                </span>
            </button>
            ))}
        </div>
        </div>
    );
};