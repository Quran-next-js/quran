"use client";

import { Offcanvas, Accordion } from "react-bootstrap";

import DarkMode from "@/components/DarkMode";
import ReminderTime from "@/components/ReminderTime";
import MushfInfo from "@/components/MushfInfo";
import Memoriz from "@/components/Memoriz";
import MushafSwitcher from "@/components/MushafSwitcher";

export default function SettingOffcanvas({ isOpen, setIsOpen, currentPage, goToPage, setIsMemorizationMode, isMemorizationMode }) {
  return (
    <Offcanvas
      show={isOpen}
      onHide={() => setIsOpen(false)}
      placement="bottom"
      scroll
      backdrop
      style={{ height: "90%" }}
    >
      <Offcanvas.Header
        closeButton
        className="bg-green-600 text-white"
        style={{ direction: "rtl" }} >
        <Offcanvas.Title>الإعدادات</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ direction: "rtl" }}>
        <Accordion defaultActiveKey="1" alwaysOpen>
          {/* عن المصحف */}
          <MushfInfo />
          {/* اعدادت */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <span className="text-right w-full text-2xl font-bold"> الإعدادات المتقدمة : </span>
            </Accordion.Header>
            <Accordion.Body>
              {/* الوضع الداكن */}
              <DarkMode />
              {/* التذكير  */}
              <ReminderTime />
              {/* التسميع  */}
              <Memoriz
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                currentPage={currentPage}
                goToPage={goToPage}
                setIsMemorizationMode={setIsMemorizationMode}
                isMemorizationMode={isMemorizationMode}
              />
              {/* التبديل بين المصاحف */}
              <MushafSwitcher />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
