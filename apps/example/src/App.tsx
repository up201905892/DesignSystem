import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@up201905892/ui';
import { MoonIcon, SunIcon, UserIcon } from '@up201905892/icons';
import { currentUser } from './data';
import { useTheme } from './theme';
import { Overview } from './Overview';
import { Tasks } from './Tasks';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState('overview');

  return (
    <Tabs value={view} onValueChange={setView} className="ds-example-app">
      <a className="ds-example-skip" href="#main">
        Skip to content
      </a>
      <header className="ds-example-header">
        <p className="ds-example-brand">TeamTasks</p>
        <nav className="ds-example-nav" aria-label="Main">
          <TabsList aria-label="Views">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </nav>
        <div className="ds-example-actions">
          <IconButton
            variant="ghost"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleTheme}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton variant="ghost" aria-label="User menu" icon={<UserIcon />} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="ds-example-main">
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="tasks">
          <Tasks />
        </TabsContent>
      </main>
    </Tabs>
  );
}
