<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

    use App\Models\User;
    use Filament\Forms\Components\Checkbox;
    use Filament\Forms\Components\DatePicker;
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
    use Filament\Tables\Columns\ImageColumn;
    use Filament\Tables\Columns\TextColumn;
    use Filament\Tables\Table;

    class FriendsRelationManager extends RelationManager {
        protected static string $relationship = 'friends';

        PUBLIC function form(Form $form): Form
        {
        return $form
        ->schema([
        TextInput::make('name')
        ->required(),

        TextInput::make('email')
        ->required(),

        DatePicker::make('email_verified_at')
        ->label('Email Verified Date'),

        TextInput::make('password')
        ->required(),

        DatePicker::make('last_time_online'),

        Placeholder::make('created_at')
        ->label('Created Date')
        ->content(fn (?User $record): string => $record?->created_at?->diffForHumans() ?? '-'),

        Placeholder::make('updated_at')
        ->label('Last Modified Date')
        ->content(fn (?User $record): string => $record?->updated_at?->diffForHumans() ?? '-'),

        Select::make('current_team_id')
        ->relationship('currentTeam', 'name')
        ->searchable(),

        Checkbox::make('is_suspended'),
        ]);
        }

        PUBLIC function table(Table $table): Table
        {
        return $table
        ->recordTitleAttribute('name')
        ->columns([
        TextColumn::make('name')
        ->searchable()
        ->sortable(),

        TextColumn::make('email')
        ->searchable()
        ->sortable(),

        TextColumn::make('email_verified_at')
        ->label('Email Verified Date')
        ->date(),

        ImageColumn::make('profile_image'),

        TextColumn::make('last_time_online')
        ->date(),

        TextColumn::make('currentTeam.name')
        ->searchable()
        ->sortable(),

        TextColumn::make('is_suspended'),
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
