<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

    use App\Models\Team;
    use Filament\Forms\Components\DatePicker;
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

    class TeamsRelationManager extends RelationManager {
        protected static string $relationship = 'teams';

        PUBLIC function form(Form $form): Form
        {
        return $form
        ->schema([
        TextInput::make('owner_id')
        ->integer(),

        TextInput::make('name')
        ->required(),

        DatePicker::make('last_message_timestamp'),

        Placeholder::make('created_at')
        ->label('Created Date')
        ->content(fn (?Team $record): string => $record?->created_at?->diffForHumans() ?? '-'),

        Placeholder::make('updated_at')
        ->label('Last Modified Date')
        ->content(fn (?Team $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
        ]);
        }

        PUBLIC function table(Table $table): Table
        {
        return $table
        ->recordTitleAttribute('name')
        ->columns([
        TextColumn::make('owner_id'),

        TextColumn::make('name')
        ->searchable()
        ->sortable(),

        TextColumn::make('last_message_timestamp')
        ->date(),

        TextColumn::make('created_at')
        ->label('Created Date')
        ->date(),

        TextColumn::make('updated_at')
        ->label('Updated Date')
        ->date(),
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
