<?php

use App\Console\Commands\UpdateLastTimeOnlineCommand;


Schedule::command(UpdateLastTimeOnlineCommand::class)->daily();
