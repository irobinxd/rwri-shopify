<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Get the Artisan application instance.
     *
     * @return \Illuminate\Console\Application
     */
    protected function getArtisan()
    {
        if (is_null($this->artisan)) {
            $this->artisan = (new \Illuminate\Console\Application($this->app, $this->events, $this->app->version()))
                ->resolveCommands($this->commands)
                ->setContainerCommandLoader();

            // Use our custom command loader that ensures Laravel instance is set
            // Access commandMap via reflection since it's protected
            $reflection = new \ReflectionClass($this->artisan);
            $commandMapProperty = $reflection->getProperty('commandMap');
            $commandMapProperty->setAccessible(true);
            $commandMap = $commandMapProperty->getValue($this->artisan);

            $this->artisan->setCommandLoader(
                new ContainerCommandLoader($this->app, $commandMap)
            );

            if ($this->symfonyDispatcher instanceof \Symfony\Contracts\EventDispatcher\EventDispatcherInterface) {
                $this->artisan->setDispatcher($this->symfonyDispatcher);
                $this->artisan->setSignalsToDispatchEvent();
            }
        }

        return $this->artisan;
    }
}
