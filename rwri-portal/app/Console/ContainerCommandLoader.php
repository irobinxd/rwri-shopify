<?php

namespace App\Console;

use Illuminate\Console\ContainerCommandLoader as BaseContainerCommandLoader;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class ContainerCommandLoader extends BaseContainerCommandLoader
{
    /**
     * Resolve a command from the container.
     *
     * @param  string  $name
     * @return \Symfony\Component\Console\Command\Command
     *
     * @throws \Symfony\Component\Console\Exception\CommandNotFoundException
     */
    public function get(string $name): SymfonyCommand
    {
        $command = parent::get($name);
        
        // Ensure Laravel instance is set on commands
        if ($command instanceof Command && ! $command->getLaravel()) {
            $command->setLaravel($this->container);
        }
        
        return $command;
    }
}

