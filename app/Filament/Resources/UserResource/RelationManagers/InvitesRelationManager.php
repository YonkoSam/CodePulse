<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

    use Filament\Forms\Components\Placeholder;
    use Filament\Forms\Components\TextInput;
    use Filament\Forms\Form;
    use Filament\Resources\RelationManagers\RelationManager;
    use Filament\Tables\Actions\BulkActionGroup;
    use Filament\Tables\Actions\CreateAction;
    use Filament\Tables\Actions\DeleteAction;
    use Filament\Tables\Actions\DeleteBulkAction;
    use Filament\Tables\Actions\EditAction;
    use Filament\Tables\Columns\TextColumn;
    use Filament\Tables\Table;
    use Mpociot\Teamwork\TeamInvite;

    class InvitesRelationManager extends RelationManager {
        protected static string $relationship = 'invites';

        PUBLIC function form(Form $form): Form
        {
        return $form
        ->schema([
        TextInput::make('user_id')
        ->required()
        ->integer(),

        TextInput::make('team_id')
        ->required()
        ->integer(),

        TextInput::make('type')
        ->required(),

        Placeholder::make('created_at')
        ->label('Created Date')
        ->content(fn (?TeamInvite $record): string => $record?->created_at?->diffForHumans() ?? '-'),

        Placeholder::make('updated_at')
        ->label('Last Modified Date')
        ->content(fn (?TeamInvite $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
        ]);
        }

        PUBLIC function table(Table $table): Table
        {
        return $table
        ->recordTitleAttribute('email')
        ->columns([
        TextColumn::make('user_id'),

        TextColumn::make('team_id'),

        TextColumn::make('type'),
        ])
        ->filters([
        //
        ])
        ->headerActions([
        CreateAction::make(),
        ])
        ->actions([
        EditAction::make(),
        DeleteAction::make(),
        ])
        ->bulkActions([
        BulkActionGroup::make([
        DeleteBulkAction::make(),
        ]),
        ]);
        }
    }
