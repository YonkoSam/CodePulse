<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

    use App\Models\FriendRequest;
    use Filament\Forms\Components\Placeholder;
    use Filament\Forms\Components\Select;
    use Filament\Forms\Form;
    use Filament\Resources\RelationManagers\RelationManager;
    use Filament\Tables\Actions\BulkActionGroup;
    use Filament\Tables\Actions\CreateAction;
    use Filament\Tables\Actions\DeleteAction;
    use Filament\Tables\Actions\DeleteBulkAction;
    use Filament\Tables\Actions\EditAction;
    use Filament\Tables\Columns\TextColumn;
    use Filament\Tables\Table;

    class ReceivedFriendRequestsRelationManager extends RelationManager {
        protected static string $relationship = 'receivedFriendRequests';

        PUBLIC function form(Form $form): Form
        {
        return $form
        ->schema([
        Select::make('sender_id')
        ->relationship('sender', 'name')
        ->searchable()
        ->required(),

        Placeholder::make('created_at')
        ->label('Created Date')
        ->content(fn (?FriendRequest $record): string => $record?->created_at?->diffForHumans() ?? '-'),

        Placeholder::make('updated_at')
        ->label('Last Modified Date')
        ->content(fn (?FriendRequest $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
        ]);
        }

        PUBLIC function table(Table $table): Table
        {
        return $table
        ->recordTitleAttribute('id')
        ->columns([
        TextColumn::make('sender.name')
        ->searchable()
        ->sortable(),
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
