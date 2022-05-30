import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { IoIosMail, IoIosMailOpen, IoIosSend } from 'react-icons/io';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { format, formatRelative } from 'date-fns';
import { enUS } from 'date-fns/esm/locale';

const MessagesModal = ({ message, currentPage, limit, setMessages, setMaxPage, setTotalMsg }) => {
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(message.is_new);
  const [isRead, setIsRead] = useState(message.is_read);

  const renderContent = () => {
    return message.content?.split('|').map((sentence, index) => (
      <span key={index} className="first-of-type:mb-3 mb-2 last-of-type:mb-0">
        {sentence}
      </span>
    ));
  };

  const formatRelativeLocale = {
    lastWeek: "'Last' eeee",
    yesterday: "'Yesterday'",
    today: 'p',
    tomorrow: "'Tomorrow'",
    nextWeek: 'eeee do',
    other: 'P',
  };

  return (
    <>
      <div className="w-full xl:w-[780px] h-24 rounded-lg hover:bg-gray-50 ring-1 hover:ring ring-gray-300 flex focus:outline-none transition cursor-pointer">
        <div
          onClick={async () => {
            try {
              setOpen(true);
              if (!message.is_read) {
                setIsNew(false);
                setIsRead(true);
                await Axios.patch(`${API_URL}/message/read/${message.id}`);
              }
            } catch (err) {
              toast.error('Unable to set message as read!', { position: 'bottom-left', theme: 'colored' });
            }
          }}
          className="flex h-full w-[90%]"
        >
          <div className="w-[10%] h-full flex items-center justify-center">
            <div className="relative text-2xl lg:text-3xl">
              {isRead ? (
                <IoIosMailOpen className="text-gray-600 text-opacity-80" />
              ) : (
                <IoIosMail className="text-gray-600 text-opacity-80" />
              )}
              {isNew ? (
                <div className="h-[10px] w-[10px] absolute top-[2px] -right-[2px] rounded-lg bg-white flex justify-center items-center">
                  <span className="h-[8px] w-[8px] rounded-full bg-red-400"></span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-[45%] h-full flex flex-col justify-center">
            <span
              className={`text-md md:text-sm lg:text-lg ${
                isRead ? 'font-semibold text-gray-400' : 'font-bold'
              } text-zinc-700 hover:text-sky-400 hover:text-opacity-70 transition line-clamp-1`}
            >
              {message.header}
            </span>
            <span className="text-xs lg:text-sm text-gray-500 text-opacity-70 line-clamp-1">{message.content?.replace('|', ' ')}</span>
          </div>
          <div className="h-full w-[28%] flex flex-col justify-center pl-2">
            <span className="text-sm text-gray-500 text-opacity-70 leading-none">From:</span>
            <span className="text-sm md:text-xs lg:text-base font-bold text-gray-600 line-clamp-1">
              {message.to === 'user' ? 'Heizen Berg Admin Team' : `ID #${message.userId} (${message.user?.name})`}
            </span>
          </div>
          <div className="w-[17%] h-full flex flex-col justify-center">
            <span className="text-sm text-gray-500 text-opacity-70 leading-none">Received:</span>
            <span className="text-xs lg:text-base font-semibold text-gray-600">
              {formatRelative(new Date(message.createdAt), new Date(), {
                locale: { ...enUS, formatRelative: (token) => formatRelativeLocale[token] },
              })}
            </span>
          </div>
        </div>
        <div className="w-[10%] h-full justify-center flex items-center">
          <BsTrash
            onClick={async () => {
              try {
                let response;

                if (message.to === 'user') {
                  response = await Axios.post(`${API_URL}/message/delete-user/${message.id}`, {
                    userId: message.userId,
                    limit,
                    currentPage,
                  });
                } else {
                  response = await Axios.post(`${API_URL}/message/delete-admin/${message.id}`, {
                    limit,
                    currentPage,
                  });
                }

                setMessages(response.data.rows);
                setMaxPage(response.data.maxPage);
                setTotalMsg(response.data.count);

                toast.success(response.data.message, { position: 'bottom-left', theme: 'colored' });
              } catch (err) {
                toast.error('Unable to delete message!', { position: 'bottom-left', theme: 'colored' });
              }
            }}
            className="text-xl lg:text-2xl text-gray-500 hover:text-red-500 active:scale-95 transition cursor-pointer"
          />
        </div>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 z-30 flex justify-center items-center" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-90 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-90 -translate-y-2"
          >
            <div className="w-[75%] sm:w-[65%] md:w-[60%] lg:w-[55%] xl:w-[45%] bg-gray-50 rounded-lg fixed z-20 shadow">
              <div className="flex flex-col px-5 p-2">
                <div className="w-full flex flex-col">
                  <span className="text-base lg:text-xl font-bold text-gray-600 my-[2px]">{message.header}</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <IoIosSend className="text-emerald-300" />:
                      <span className="text-gray-800 font-semibold ml-1 text-sm lg:text-base">
                        {message.to === 'user' ? 'Heizen Berg Admin Team' : `ID #${message.userId} (${message.user?.name})`}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-semibold mt-auto">{format(new Date(message.createdAt), 'PPPp')}</span>
                  </div>
                </div>
                <div className="w-full h-[1px] my-1 bg-gradient-to-r from-sky-400 to-emerald-400 mx-auto" />
              </div>
              <div className="w-full h-56 px-4 pb-3">
                <div className="w-full h-full rounded-xl p-3 bg-gray-200 bg-opacity-80 text-xs md:text-sm">
                  <div className="flex flex-col">{renderContent()}</div>
                  {message.to === 'user' && (
                    <div className="flex items-center">
                      <span>
                        <i>{message.admin?.name} -Heizen Berg Co. Admin Team</i>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center px-4 pb-3">
                <button
                  onClick={() => setOpen(false)}
                  className="h-10 w-32 bg-gradient-to-r from-sky-500 to-sky-400 hover:brightness-110 transition active:scale-95 rounded-lg font-bold text-white focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default MessagesModal;
