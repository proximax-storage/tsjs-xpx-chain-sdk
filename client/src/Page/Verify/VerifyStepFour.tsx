import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import CountDownTimer from '../../Component/CountdownTimer';
import { storage } from '../../Util/Firebase/FirebaseConfig';
import PDFViewer from '../../Component/PDFViewer';

import './VerifyStepFour.scss';

const VerifyStepFour: React.FC = () => {
  const [researchIndex, setResearchIndex] = useState(1);
  const [hasDownload, setHasDownload] = useState(false);
  const [hasFinishDowload, setHasFinishDowload] = useState(false);
  const [vote, setVote] = useState('');
  const [voted, setVoted] = useState(false);
  const [researchFileList, setResearchFileList] = useState({});
  const [researchFileNameList, setResearchFileNameList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useHistory();

  useEffect(() => {
    setResearchFileNameList([
      'Thu Jun 17 2021 06:08:51 GMT+0800 (Malaysia Time)_SAMPLE 1.pdf',
      'Thu Jun 17 2021 06:09:08 GMT+0800 (Malaysia Time)_SAMPLE 2.pdf',
      'Thu Jun 17 2021 06:09:16 GMT+0800 (Malaysia Time)_SAMPLE 3.pdf',
      'Thu Jun 17 2021 06:09:25 GMT+0800 (Malaysia Time)_SAMPLE 4.pdf',
      'Thu Jun 17 2021 06:09:32 GMT+0800 (Malaysia Time)_SAMPLE 5.pdf',
    ]);
  }, []);

  useEffect(() => {
    console.log(researchFileNameList);

    if (researchFileNameList.length === 5 && !hasDownload) {
      researchFileNameList.forEach((x, index) => {
        downloadPDF(x, index + 1);
      });

      setHasDownload(true);
    }
  }, [researchFileNameList]);

  useEffect(() => {
    setVoted(!!vote);
  }, [vote]);

  useEffect(() => {
    if (Object.keys(researchFileList).length === 5) {
      setSelectedFile(researchFileList[1]);

      setHasFinishDowload(true);
    }

    console.log(researchFileList);
  }, [researchFileList]);

  const downloadPDF = (filename: string, index: number) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(filename);

    fileRef
      .getDownloadURL()
      .then((url) => {
        let blob;

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = (event) => {
          blob = xhr.response;

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String = reader.result;
            const newObj = researchFileList;
            newObj[index] = base64String;
            setResearchFileList({ ...newObj });

            console.log(Object.keys(researchFileList).length);
            console.log(newObj);
          };
        };

        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const onRealSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('real');
  };

  const onFakeSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('fake');
  };

  const onResearchSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    setResearchIndex(index);

    setSelectedFile(researchFileList[index]);
  };

  const onNext = () => {
    history.push('/verify-step-five');
  };

  return (
    <div className='verify-step-four'>
      <div className='verify-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 0, minutes: 30, seconds: 0 }}
          isHour={true}
        />
      </div>

      <div className='verify-step-four__container'>
        <div className='verify-step-four__container__left'>
          <div className='verify-step-four__container__left__button_group'>
            {[1, 2, 3, 4, 5].map((x) => {
              return (
                <button
                  key={x}
                  className={
                    researchIndex == x
                      ? `verify-step-four__container__left__active`
                      : ''
                  }
                  onClick={(e) => onResearchSelected(e, x)}
                >
                  Research {x}
                </button>
              );
            })}
          </div>
          <div className='verify-step-four__container__left__pdf-viewer'>
            {hasFinishDowload ? <PDFViewer pdf={selectedFile} /> : 'Loading'}
            {/* Loading */}
          </div>
        </div>
        <div className='verify-step-four__container__right'>
          <div className='verify-step-four__tweet'>
            <Tweet
              name='Jill Chenraya'
              tag='@jillcry'
              content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
              submitBy='Jackie Chan'
              submitTime={new Date()}
              authenticityScore={67}
              stage='Verifying'
            />
          </div>
          <div className='verify-step-four__container__right__button_group'>
            <button
              className={vote === 'real' ? 'selected-real' : 'deselected-real'}
              onClick={(e) => onRealSelected(e)}
            >
              Real
            </button>
            <button
              className={vote === 'fake' ? 'selected-fake' : 'deselected-fake'}
              onClick={(e) => onFakeSelected(e)}
            >
              Fake
            </button>
          </div>
          <button className='confirm' onClick={onNext} disabled={!voted}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyStepFour;
