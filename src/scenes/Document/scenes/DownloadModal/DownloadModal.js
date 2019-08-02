import React, { useEffect, useState } from 'react';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from 'utils/download';

import './DownloadModal.css';
import '../PolicyErrorModal/PolicyErrorModal.css';

import PolicyUtils from 'utils/policy';

export default ({ onClose, encrypted, virtruClient }) => {
  const [decrypting, setDecrypting] = useState(false);

  function showPolicyErrorModal() {
    return (
      <div className="policy-error-modal">
        <Modal onClose={onClose}>
          <h4 className="policy-error-modal-title">Restricted Policy</h4>
          <span>Files with 'Watermarking' must be opened in Virtru Secure Reader.</span>
          <br />
          <br />
          <Button
            fullWidth
            onClick={() => window.open('https://secure.virtru.com/secure-reader', '_blank')}
          >
            Go There
          </Button>
          <Button fullWidth variant="alternateButton" onClick={onClose}>
            Not Now
          </Button>
          <br />
        </Modal>
      </div>
    );
  }

  function showDecryptAndDownloadModal() {
    const decryptAndDownload = async () => {
      setDecrypting(true);
      try {
        await downloadDecrypted({ encrypted, virtruClient });
      } catch (err) {
        console.error(err);
        alert('File could not be decrypted');
      } finally {
        setDecrypting(false);
      }
    };

    return (
      <div className="download-modal">
        <Modal onClose={onClose}>
          <h4 className="download-title">Download File</h4>
          <span>Share with others:</span>
          <br />
          <Button fullWidth onClick={() => downloadHtml(encrypted)}>
            Download HTML
          </Button>
          <span>Inspect the metadata:</span>
          <br />
          <Button fullWidth onClick={() => downloadTdf(encrypted)}>
            Download TDF
          </Button>
          <span>See the original file:</span>
          <br />
          <Button
            disabled={decrypting}
            fullWidth
            variant="alternateButton"
            onClick={decryptAndDownload}
          >
            {decrypting ? 'Decrypting...' : 'Decrypt and Download'}
          </Button>
        </Modal>
      </div>
    );
  }

  const DetermineModal = () => {
    const [whichModal, setWhichModal] = useState(null);

    useEffect(() => {
      PolicyUtils.policyFlagCheck({ encrypted, virtruClient }).then(res => {
        const selectedModal = res ? showPolicyErrorModal() : showDecryptAndDownloadModal();
        setWhichModal(selectedModal);
      });
    });

    return null;
  };

  DetermineModal();
};
