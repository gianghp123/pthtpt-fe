
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', // Nền tối mờ
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ marginTop: 0 }}>Xác nhận</h3>
        <p>{message || "Bạn có chắc chắn muốn thực hiện hành động này?"}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={onCancel}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '4px' }}
          >
            Không
          </button>
          
          <button 
            onClick={onConfirm}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;