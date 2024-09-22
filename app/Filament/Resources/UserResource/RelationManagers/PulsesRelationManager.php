<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

    use App\Models\Pulse;
    use Filament\Forms\Components\Checkbox;
    use Filament\Forms\Components\MarkdownEditor;
    use Filament\Forms\Components\Placeholder;
    use Filament\Forms\Components\Select;
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

    class PulsesRelationManager extends RelationManager {
        protected static string $relationship = 'pulses';

        PUBLIC function form(Form $form): Form
        {
        return $form
        ->schema([
        Select::make('user_id')
        ->relationship('user', 'name')
        ->searchable()
        ->required(),

        TextInput::make('title')
        ->required(),

        MarkdownEditor::make('text')
        ->required(),

        Select::make('team_id')
        ->relationship('team', 'name')
        ->searchable(),

        Placeholder::make('created_at')
        ->label('Created Date')
        ->content(fn (?Pulse $record): string => $record?->created_at?->diffForHumans() ?? '-'),

        Placeholder::make('updated_at')
        ->label('Last Modified Date')
        ->content(fn (?Pulse $record): string => $record?->updated_at?->diffForHumans() ?? '-'),

        Checkbox::make('is_answered'),
        ]);
        }

        PUBLIC function table(Table $table): Table
        {
        return $table
        ->recordTitleAttribute('title')
        ->columns([
        TextColumn::make('user.name')
        ->searchable()
        ->sortable(),

        TextColumn::make('title')
        ->searchable()
        ->sortable(),

        TextColumn::make('code'),

        TextColumn::make('team.name')
        ->searchable()
        ->sortable(),

        TextColumn::make('is_answered'),
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
