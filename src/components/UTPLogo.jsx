// ============================================================
// UTP Logo Component – Imagen oficial
// ============================================================

const UTP_LOGO_URL = 'https://visualizate.utpxpedition.com/sites/default/files/2020-02/logo-visualizate.png';

const UTPLogo = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={UTP_LOGO_URL}
        alt="Universidad Tecnológica del Perú"
        className={`${sizes[size]} w-auto object-contain`}
        loading="eager"
      />
    </div>
  );
};

export default UTPLogo;
