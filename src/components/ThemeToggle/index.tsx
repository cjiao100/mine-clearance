import React, { useEffect, useState } from "react";
import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon.svg";

const ThemeToggle: React.FC = () => {
    // 添加主题状态，从localStorage中获取
    const [theme, setTheme] = useState(() => {
      return localStorage.getItem('theme') || 'light';
    });

    // 主题切换处理函数
    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };

    // 页面加载时设置主题
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

  return (
    <label className="
      fixed top-5 right-5
      theme-toggle-btn
      backdrop-blur-sm
      transition-all duration-300 ease-in-out
      hover:scale-110
      active:scale-95
      cursor-pointer
      swap
      z-50
    ">
      <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeChange} className="theme-controller hidden" />

      {/* 太阳图标 - 白天模式 */}
      <img src={SunIcon} className="swap-on w-6 h-6 transition-all duration-500 ease-in-out hover:rotate-45" alt="白天模式" />

      {/* 月亮图标 - 夜间模式 */}
      <img src={MoonIcon} className="swap-off w-6 h-6 transition-all duration-500 ease-in-out hover:-rotate-45" alt="夜间模式" />
    </label>
  );
}

export default ThemeToggle;