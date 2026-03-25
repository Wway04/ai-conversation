import { ReactNode } from 'react';
import { I18N_LANGUAGES } from '@/i18n/config';
import { Language } from '@/i18n/types';
import { ChevronDown, Globe, Moon, Bot } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/providers/i18n-provider';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <div className="flex items-center gap-3 p-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Bot className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Chat</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Globe className="size-4" />
            <div className="flex grow items-center justify-between">
              <span>Language</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <img src={currentLanguage.flag} className="size-4 rounded-full" alt={currentLanguage.label} />
                <ChevronDown className="size-3 text-gray-400" />
              </div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44">
            <DropdownMenuRadioGroup
              value={currentLanguage.code}
              onValueChange={(value) => {
                const lang = I18N_LANGUAGES.find((l) => l.code === value);
                if (lang) changeLanguage(lang as Language);
              }}
            >
              {I18N_LANGUAGES.map((item) => (
                <DropdownMenuRadioItem key={item.code} value={item.code} className="flex items-center gap-2">
                  <img src={item.flag} className="w-4 h-4 rounded-full" alt={item.label} />
                  <span>{item.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
          <Moon className="size-4" />
          <div className="flex items-center gap-2 justify-between grow">
            <span>Dark Mode</span>
            <Switch size="sm" checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
